import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { Player } from '@/types';
import { Card } from '@/components/ui/card';

interface PlayerCardProps {
  player: Player;
  isWinner?: boolean;
  position: number;
}

export const PlayerCard = ({ player, isWinner = false, position }: PlayerCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getPerformanceColor = (netPoints: number) => {
    const maxPoints = Math.max(...[player.netPoints]); // You'd calculate this globally
    const percentage = maxPoints > 0 ? (netPoints / maxPoints) * 100 : 0;
    
    if (percentage >= 80) return 'performance-excellent';
    if (percentage >= 60) return 'performance-good';
    if (percentage >= 40) return 'performance-average';
    return 'performance-poor';
  };

  const recentGameweeks = player.gameweekHistory.slice(-3);

  return (
    <div className={`flip-card h-64 ${isWinner ? 'winner-pulse' : ''}`}>
      <div 
        className="flip-card-inner cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <Card className={`flip-card-front p-6 hover-lift ${
          isWinner ? 'bg-gradient-to-br from-winner to-winner-glow border-winner' : 'bg-card'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-orbitron font-bold text-muted-foreground">
                #{position}
              </span>
              {isWinner && <Trophy className="w-6 h-6 text-winner-glow animate-pulse" />}
            </div>
            <div className={`w-3 h-3 rounded-full bg-${getPerformanceColor(player.netPoints)}`} />
          </div>

          <h3 className="font-orbitron font-bold text-lg mb-4 line-clamp-2">
            {player.manager}
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Net Points</span>
              <span className="font-bold text-primary gradient-text count-up">
                {player.netPoints}
              </span>
            </div>

            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full progress-fill transition-all duration-1000"
                style={{ width: `${Math.min((player.netPoints / 100) * 100, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Total Points</span>
                <span className="font-semibold">{player.totalPoints}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Wins</span>
                <span className="font-semibold flex items-center gap-1">
                  {player.wins} <Trophy className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Back of card */}
        <Card className="flip-card-back p-6 bg-muted">
          <div className="h-full flex flex-col">
            <h3 className="font-orbitron font-bold text-lg mb-4">
              Recent Performance
            </h3>
            
            <div className="space-y-3 flex-1">
              {recentGameweeks.length > 0 ? (
                recentGameweeks.map((gw, index) => (
                  <div key={gw.gameweek} className="flex justify-between items-center p-3 bg-card rounded">
                    <span className="text-sm">GW {gw.gameweek}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{gw.netPoints}</span>
                      {gw.netPoints > 0 ? (
                        <TrendingUp className="w-4 h-4 text-performance-excellent" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-performance-poor" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No gameweek data yet
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span>Transfer Points</span>
                <span className="text-performance-poor">-{player.transferPoints}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};