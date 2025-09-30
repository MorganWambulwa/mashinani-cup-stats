import { useState } from 'react';
import { Trophy, Settings, BarChart3, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerCard } from '@/components/PlayerCard';
import { PaymentCard } from '@/components/PaymentCard';
import { PaymentHistory } from '@/components/PaymentHistory';
import { PrizePool } from '@/components/PrizePool';
import { GameweekForm } from '@/components/GameweekForm';
import { Leaderboard } from '@/components/Leaderboard';
import { WinnerCard } from '@/components/WinnerCard';
import { InfoSlider } from '@/components/InfoSlider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { initialParticipants } from '@/data/participants';
import { Player } from '@/types';

const Index = () => {
  const [players, setPlayers] = useState<Player[]>(initialParticipants);
  const [currentGameweek, setCurrentGameweek] = useState(1);

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

  const handlePaymentUpdate = (manager: string, amount: number) => {
    setPlayers(prevPlayers => 
      prevPlayers.map(player => 
        player.manager === manager 
          ? { 
              ...player, 
              amountPaid: player.amountPaid + amount,
              gameweeksPaid: Math.floor((player.amountPaid + amount) / 100)
            }
          : player
      )
    );
  };

  const handleDeleteManager = (manager: string) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player.manager !== manager));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-orbitron text-xl font-bold gradient-text">
                Mashinani League Cup
              </h1>
              <p className="text-sm text-muted-foreground">Fantasy Premier League Mini-League</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Gameweek {currentGameweek}</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Winner Section */}
        <section>
          <WinnerCard players={players} currentGameweek={currentGameweek} />
        </section>

        {/* Info Slider */}
        <section>
          <InfoSlider />
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="players" className="gap-2">
              <Users className="w-4 h-4" />
              Players
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Settings className="w-4 h-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Players Grid */}
          <TabsContent value="players" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-orbitron text-2xl font-bold">All Participants</h2>
              <p className="text-muted-foreground">Click cards to flip and see recent performance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players
                .sort((a, b) => b.netPoints - a.netPoints)
                .map((player, index) => (
                  <PlayerCard
                    key={player.manager}
                    player={player}
                    position={index + 1}
                    isWinner={winner?.manager === player.manager}
                  />
                ))}
            </div>
          </TabsContent>

          {/* Payments */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-orbitron text-2xl font-bold">Payment Management</h2>
              <p className="text-muted-foreground">KSh 100 per gameweek • Total: KSh 3,800</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <PrizePool />
              <PaymentHistory />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {players.map((player) => (
                <PaymentCard
                  key={player.manager}
                  player={player}
                  onUpdatePayment={handlePaymentUpdate}
                />
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard players={players} />
          </TabsContent>

          {/* Admin Panel */}
          <TabsContent value="admin" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-orbitron text-2xl font-bold">Admin Panel</h2>
                <p className="text-muted-foreground">Update gameweek scores and manage the league</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentGameweek(Math.max(1, currentGameweek - 1))}
                  disabled={currentGameweek <= 1}
                >
                  Previous GW
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentGameweek(Math.min(38, currentGameweek + 1))}
                  disabled={currentGameweek >= 38}
                >
                  Next GW
                </Button>
              </div>
            </div>
            
            <GameweekForm 
              players={players} 
              onUpdatePlayers={setPlayers} 
              onDeleteManager={handleDeleteManager}
            />
          </TabsContent>
        </Tabs>

        {/* Stats Footer */}
        <footer className="pt-8 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-orbitron font-bold gradient-text">11</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-orbitron font-bold gradient-text">38</div>
              <div className="text-sm text-muted-foreground">Gameweeks</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-orbitron font-bold gradient-text">1,100</div>
              <div className="text-sm text-muted-foreground">Prize per GW</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-orbitron font-bold gradient-text">
                {players.reduce((sum, p) => sum + p.wins, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Wins</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
