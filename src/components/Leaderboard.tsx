import { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LeaderboardProps {
  players: Player[];
}

export const Leaderboard = ({ players }: LeaderboardProps) => {
  const [sortBy, setSortBy] = useState<'netPoints' | 'wins'>('netPoints');
  const [viewMode, setViewMode] = useState<'overall' | 'gameweek'>('overall');
  const [selectedGameweek, setSelectedGameweek] = useState(1);

  const sortedPlayers = [...players].sort((a, b) => {
    if (viewMode === 'gameweek') {
      const aGameweek = a.gameweekHistory.find(g => g.gameweek === selectedGameweek);
      const bGameweek = b.gameweekHistory.find(g => g.gameweek === selectedGameweek);
      return (bGameweek?.netPoints || 0) - (aGameweek?.netPoints || 0);
    }
    if (sortBy === 'netPoints') {
      return b.netPoints - a.netPoints;
    }
    return b.wins - a.wins;
  });

  const maxGameweek = Math.max(...players.flatMap(p => p.gameweekHistory.map(g => g.gameweek)), 1);

  const handleNextGameweek = () => {
    if (selectedGameweek < maxGameweek) {
      setSelectedGameweek(prev => prev + 1);
    }
  };

  const handlePreviousGameweek = () => {
    if (selectedGameweek > 1) {
      setSelectedGameweek(prev => prev - 1);
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-winner" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{position}</span>;
    }
  };

  const getPositionGradient = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-winner/20 to-winner-glow/20 border-winner/30';
      case 2:
        return 'bg-gradient-to-r from-slate-400/20 to-slate-300/20 border-slate-400/30';
      case 3:
        return 'bg-gradient-to-r from-orange-500/20 to-orange-400/20 border-orange-500/30';
      default:
        return 'bg-card hover:bg-muted/50';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-orbitron flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Leaderboard
        </CardTitle>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'netPoints' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('netPoints')}
            >
              By Net Points
            </Button>
            <Button
              variant={sortBy === 'wins' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('wins')}
            >
              By Wins
            </Button>
            <Button
              variant={viewMode === 'gameweek' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(viewMode === 'gameweek' ? 'overall' : 'gameweek')}
            >
              {viewMode === 'gameweek' ? 'Overall View' : 'Gameweek View'}
            </Button>
          </div>
          {viewMode === 'gameweek' && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousGameweek}
                disabled={selectedGameweek === 1}
              >
                Previous GW
              </Button>
              <span className="text-sm font-semibold px-3">Gameweek {selectedGameweek}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextGameweek}
                disabled={selectedGameweek === maxGameweek}
              >
                Next GW
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const position = index + 1;
            return (
              <div
                key={player.manager}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border transition-all duration-300 hover-lift ${getPositionGradient(position)}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {getPositionIcon(position)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{player.manager}</h3>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {viewMode === 'gameweek' 
                        ? `${player.gameweekHistory.find(g => g.gameweek === selectedGameweek)?.netPoints || 0} net points (GW${selectedGameweek})`
                        : sortBy === 'netPoints' ? `${player.netPoints} net points` : `${player.wins} wins`
                      }
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:flex sm:gap-4 md:gap-6 gap-2 text-xs sm:text-sm">
                  {viewMode === 'gameweek' ? (
                    <>
                      <div className="text-center">
                        <div className="font-bold text-primary">
                          {player.gameweekHistory.find(g => g.gameweek === selectedGameweek)?.points || 0}
                        </div>
                        <div className="text-muted-foreground text-xs">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-performance-poor">
                          -{player.gameweekHistory.find(g => g.gameweek === selectedGameweek)?.transferPoints || 0}
                        </div>
                        <div className="text-muted-foreground text-xs">Trans</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold gradient-text">
                          {player.gameweekHistory.find(g => g.gameweek === selectedGameweek)?.netPoints || 0}
                        </div>
                        <div className="text-muted-foreground text-xs">Net</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <div className="font-bold text-primary">{player.totalPoints}</div>
                        <div className="text-muted-foreground text-xs">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-performance-poor">-{player.transferPoints}</div>
                        <div className="text-muted-foreground text-xs">Trans</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold gradient-text">{player.netPoints}</div>
                        <div className="text-muted-foreground text-xs">Net</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-winner flex items-center justify-center gap-1">
                          {player.wins} <Trophy className="w-3 h-3" />
                        </div>
                        <div className="text-muted-foreground text-xs">Wins</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};