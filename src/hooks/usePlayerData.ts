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

      // Update or insert gameweek data for each player
      for (const player of playersData) {
        const data = gameweekData[player.manager];
        if (!data) continue;

        const points = data.points || 0;
        const transferPoints = data.transferPoints || 0;
        const netPoints = points - transferPoints;

        // Upsert gameweek data
        const { error: gwError } = await supabase
          .from('gameweek_data')
          .upsert({
            player_id: player.id,
            gameweek: gameweekNumber,
            points: points,
            transfer_points: transferPoints,
            net_points: netPoints
          }, {
            onConflict: 'player_id,gameweek'
          });

        if (gwError) throw gwError;
      }

      // Recalculate totals for all players
      for (const player of playersData) {
        const { data: allGameweeks, error: gwFetchError } = await supabase
          .from('gameweek_data')
          .select('*')
          .eq('player_id', player.id);

        if (gwFetchError) throw gwFetchError;

        const totalPoints = allGameweeks.reduce((sum, gw) => sum + gw.points, 0);
        const transferPoints = allGameweeks.reduce((sum, gw) => sum + gw.transfer_points, 0);
        const netPoints = totalPoints - transferPoints;

        // Update player totals
        const { error: updateError } = await supabase
          .from('players')
          .update({
            total_points: totalPoints,
            transfer_points: transferPoints,
            net_points: netPoints
          })
          .eq('id', player.id);

        if (updateError) throw updateError;
      }

      // Calculate wins for the updated gameweek
      const { data: gameweekResults, error: resultsError } = await supabase
        .from('gameweek_data')
        .select('player_id, net_points')
        .eq('gameweek', gameweekNumber)
        .order('net_points', { ascending: false });

      if (resultsError) throw resultsError;

      if (gameweekResults.length > 0) {
        const maxNetPoints = gameweekResults[0].net_points;
        const winners = gameweekResults.filter(r => r.net_points === maxNetPoints);

        // Reset wins for all players first
        const { data: allPlayers } = await supabase
          .from('players')
          .select('id');

        if (allPlayers) {
          for (const player of allPlayers) {
            // Count how many times this player won
            const { data: playerGameweeks } = await supabase
              .from('gameweek_data')
              .select('gameweek, net_points, player_id')
              .eq('player_id', player.id);

            if (playerGameweeks) {
              let winCount = 0;
              
              // Group by gameweek and check if player had max net points
              const gameweeks = [...new Set(playerGameweeks.map(g => g.gameweek))];
              
              for (const gw of gameweeks) {
                const { data: gwData } = await supabase
                  .from('gameweek_data')
                  .select('net_points')
                  .eq('gameweek', gw)
                  .order('net_points', { ascending: false })
                  .limit(1)
                  .single();

                const playerGwData = playerGameweeks.find(g => g.gameweek === gw);
                if (gwData && playerGwData && playerGwData.net_points === gwData.net_points) {
                  winCount++;
                }
              }

              await supabase
                .from('players')
                .update({ wins: winCount })
                .eq('id', player.id);
            }
          }
        }
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
