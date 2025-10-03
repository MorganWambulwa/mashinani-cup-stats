import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, GameweekData } from '@/types';
import { toast } from 'sonner';

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    try {
      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .order('net_points', { ascending: false });

      if (playersError) throw playersError;

      // Fetch all gameweek data
      const { data: gameweekData, error: gameweekError } = await supabase
        .from('gameweek_data')
        .select('*')
        .order('gameweek', { ascending: true });

      if (gameweekError) throw gameweekError;

      // Combine players with their gameweek history
      const playersWithHistory: Player[] = playersData.map(player => {
        const history = gameweekData
          .filter(gw => gw.player_id === player.id)
          .map(gw => ({
            gameweek: gw.gameweek,
            points: gw.points,
            transferPoints: gw.transfer_points,
            netPoints: gw.net_points
          }));

        return {
          manager: player.manager,
          totalPoints: player.total_points,
          transferPoints: player.transfer_points,
          netPoints: player.net_points,
          wins: player.wins,
          gameweekHistory: history,
          amountPaid: Number(player.amount_paid),
          gameweeksPaid: player.gameweeks_paid
        };
      });

      setPlayers(playersWithHistory);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to load player data');
    } finally {
      setLoading(false);
    }
  };

  const updateGameweekData = async (
    gameweekNumber: number,
    gameweekData: Record<string, { points: number; transferPoints: number }>
  ) => {
    try {
      // Get player IDs
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, manager');

      if (playersError) throw playersError;

      // Prepare batch upsert data
      const gameweekRecords = playersData
        .filter(player => gameweekData[player.manager])
        .map(player => {
          const data = gameweekData[player.manager];
          const points = data.points || 0;
          const transferPoints = data.transferPoints || 0;
          return {
            player_id: player.id,
            gameweek: gameweekNumber,
            points,
            transfer_points: transferPoints,
            net_points: points - transferPoints
          };
        });

      // Batch upsert all gameweek data
      if (gameweekRecords.length > 0) {
        const { error: gwError } = await supabase
          .from('gameweek_data')
          .upsert(gameweekRecords, { onConflict: 'player_id,gameweek' });

        if (gwError) throw gwError;
      }

      // Recalculate totals and wins using a single efficient query
      const { data: allGameweekData, error: allGwError } = await supabase
        .from('gameweek_data')
        .select('player_id, gameweek, points, transfer_points, net_points');

      if (allGwError) throw allGwError;

      // Calculate totals and wins for each player
      const playerUpdates = playersData.map(player => {
        const playerGws = allGameweekData.filter(gw => gw.player_id === player.id);
        
        const totalPoints = playerGws.reduce((sum, gw) => sum + gw.points, 0);
        const transferPoints = playerGws.reduce((sum, gw) => sum + gw.transfer_points, 0);
        const netPoints = totalPoints - transferPoints;

        // Calculate wins efficiently
        const gameweeks = [...new Set(playerGws.map(g => g.gameweek))];
        let wins = 0;
        
        for (const gw of gameweeks) {
          const gwRecords = allGameweekData.filter(g => g.gameweek === gw);
          const maxNetPoints = Math.max(...gwRecords.map(g => g.net_points));
          const playerGwData = playerGws.find(g => g.gameweek === gw);
          
          if (playerGwData && playerGwData.net_points === maxNetPoints) {
            wins++;
          }
        }

        return {
          id: player.id,
          total_points: totalPoints,
          transfer_points: transferPoints,
          net_points: netPoints,
          wins
        };
      });

      // Batch update all players
      for (const update of playerUpdates) {
        const { id, ...updateData } = update;
        await supabase
          .from('players')
          .update(updateData)
          .eq('id', id);
      }

      await fetchPlayers();
      toast.success(`Gameweek ${gameweekNumber} updated successfully!`);
    } catch (error) {
      console.error('Error updating gameweek data:', error);
      toast.error('Failed to update gameweek data');
    }
  };

  const updatePayment = async (manager: string, amount: number) => {
    try {
      const { data: player, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('manager', manager)
        .single();

      if (fetchError) throw fetchError;

      const newAmountPaid = Number(player.amount_paid) + amount;
      const newGameweeksPaid = Math.floor(newAmountPaid / 100);

      const { error: updateError } = await supabase
        .from('players')
        .update({
          amount_paid: newAmountPaid,
          gameweeks_paid: newGameweeksPaid
        })
        .eq('manager', manager);

      if (updateError) throw updateError;

      await fetchPlayers();
      toast.success('Payment updated successfully!');
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
    }
  };

  const deleteManager = async (manager: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('manager', manager);

      if (error) throw error;

      await fetchPlayers();
      toast.success('Manager deleted successfully!');
    } catch (error) {
      console.error('Error deleting manager:', error);
      toast.error('Failed to delete manager');
    }
  };

  useEffect(() => {
    fetchPlayers();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('players-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players'
        },
        () => {
          fetchPlayers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gameweek_data'
        },
        () => {
          fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    players,
    loading,
    updateGameweekData,
    updatePayment,
    deleteManager,
    refreshPlayers: fetchPlayers
  };
};
