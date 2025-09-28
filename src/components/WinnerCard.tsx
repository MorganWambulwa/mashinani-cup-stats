import { useEffect, useState } from 'react';
import { Trophy, Crown, Sparkles } from 'lucide-react';
import { Player } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface WinnerCardProps {
  players: Player[];
  currentGameweek: number;
}

export const WinnerCard = ({ players, currentGameweek }: WinnerCardProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Find current gameweek winner
  const getCurrentGameweekWinner = () => {
    let maxNetPoints = -Infinity;
    let winner: Player | null = null;

    players.forEach(player => {
      const currentGWData = player.gameweekHistory.find(gw => gw.gameweek === currentGameweek);
      if (currentGWData && currentGWData.netPoints > maxNetPoints) {
        maxNetPoints = currentGWData.netPoints;
        winner = player;
      }
    });

    return winner;
  };

  const winner = getCurrentGameweekWinner();

  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  if (!winner) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-card to-muted border-dashed border-2">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <Trophy className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
          </div>
          <h2 className="font-orbitron text-2xl font-bold text-muted-foreground mb-2">
            No Winner Yet
          </h2>
          <p className="text-muted-foreground">
            Update gameweek {currentGameweek} scores to see the winner!
          </p>
        </CardContent>
      </Card>
    );
  }

  const winnerGWData = winner.gameweekHistory.find(gw => gw.gameweek === currentGameweek);

  return (
    <Card className="relative overflow-hidden winner-pulse winner-drop bg-gradient-to-br from-winner to-winner-glow border-winner">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti absolute"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['hsl(40 70% 60%)', 'hsl(35 65% 55%)', 'hsl(45 75% 65%)'][i % 3]
              }}
            />
          ))}
        </div>
      )}

      <CardContent className="p-8 text-center relative z-10">
        <div className="mb-4 relative">
          <Crown className="w-20 h-20 mx-auto text-winner-glow animate-pulse" />
          <Sparkles className="w-6 h-6 absolute top-0 right-1/3 text-winner-glow animate-ping" />
          <Sparkles className="w-4 h-4 absolute bottom-2 left-1/3 text-winner-glow animate-ping delay-300" />
        </div>

        <h2 className="font-orbitron text-3xl font-bold text-white mb-2">
          Gameweek {currentGameweek} Winner!
        </h2>

        <div className="bg-black/20 rounded-lg p-4 mb-4">
          <h3 className="font-orbitron text-xl font-bold text-white mb-2">
            {winner.manager}
          </h3>
          
          <div className="flex justify-center items-center gap-6 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold count-up">{winnerGWData?.points || 0}</div>
              <div className="text-sm opacity-90">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold count-up text-red-300">-{winnerGWData?.transferPoints || 0}</div>
              <div className="text-sm opacity-90">Transfers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold count-up text-yellow-200">{winnerGWData?.netPoints || 0}</div>
              <div className="text-sm opacity-90">Net Points</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/90">
          <Trophy className="w-5 h-5" />
          <span className="font-semibold">Prize: 1,100 (11 × 100)</span>
        </div>
      </CardContent>
    </Card>
  );
};