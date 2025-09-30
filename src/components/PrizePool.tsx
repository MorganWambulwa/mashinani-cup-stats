import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, DollarSign } from "lucide-react";

interface LeagueSeason {
  id: string;
  name: string;
  total_prize_pool: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export function PrizePool() {
  const [activeSeason, setActiveSeason] = useState<LeagueSeason | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSeason();
  }, []);

  const fetchActiveSeason = async () => {
    try {
      const { data, error } = await supabase
        .from('league_seasons')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching active season:', error);
        return;
      }

      setActiveSeason(data);
    } catch (error) {
      console.error('Error fetching active season:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Prize Pool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading prize pool...</p>
        </CardContent>
      </Card>
    );
  }

  if (!activeSeason) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Prize Pool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active season found.</p>
        </CardContent>
      </Card>
    );
  }

  const prizeDistribution = {
    winner: Math.floor(activeSeason.total_prize_pool * 0.7),
    runnerUp: Math.floor(activeSeason.total_prize_pool * 0.2),
    third: Math.floor(activeSeason.total_prize_pool * 0.1)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Prize Pool - {activeSeason.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <DollarSign className="h-6 w-6" />
          KSh {activeSeason.total_prize_pool.toLocaleString()}
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold">Prize Distribution:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>🥇 Winner (70%):</span>
              <span className="font-medium">KSh {prizeDistribution.winner.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>🥈 Runner-up (20%):</span>
              <span className="font-medium">KSh {prizeDistribution.runnerUp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>🥉 Third Place (10%):</span>
              <span className="font-medium">KSh {prizeDistribution.third.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Season: {new Date(activeSeason.start_date).toLocaleDateString()} - {new Date(activeSeason.end_date).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}