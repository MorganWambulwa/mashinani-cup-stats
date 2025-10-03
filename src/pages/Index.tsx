import { useState } from 'react';
import { Trophy, Settings, BarChart3, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayerCard } from '@/components/PlayerCard';
import { PaymentCard } from '@/components/PaymentCard';
import { PaymentHistory } from '@/components/PaymentHistory';
import { PrizePool } from '@/components/PrizePool';
import { GameweekForm } from '@/components/GameweekForm';
import { Leaderboard } from '@/components/Leaderboard';
import { WinnerCard } from '@/components/WinnerCard';
import { InfoSlider } from '@/components/InfoSlider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Player } from '@/types';
import Players from './Players';
import Payments from './Payments';
import LeaderboardPage from './LeaderboardPage';
import Admin from './Admin';

interface IndexProps {
  players: Player[];
  currentGameweek: number;
  winner: Player | null;
  updatePayment: (manager: string, amount: number) => Promise<void>;
  updateGameweekData: (gameweek: number, data: Record<string, { points: number; transferPoints: number }>) => Promise<void>;
  deleteManager: (manager: string) => Promise<void>;
  onGameweekChange: (gameweek: number) => void;
}

const Index = ({ players, currentGameweek, winner, updatePayment, updateGameweekData, deleteManager, onGameweekChange }: IndexProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const loading = false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading league data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-primary rounded-lg flex-shrink-0">
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="font-orbitron text-sm sm:text-xl font-bold gradient-text truncate">
                Mashinani League Cup
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Fantasy Premier League Mini-League</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <span className="text-xs sm:text-sm text-muted-foreground">GW {currentGameweek}</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            <Button
              variant={currentPath === '/' ? 'default' : 'ghost'}
              onClick={() => navigate('/')}
              className="gap-2 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={currentPath === '/'}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Players</span>
              <span className="sm:hidden">Play</span>
            </Button>
            <Button
              variant={currentPath === '/payments' ? 'default' : 'ghost'}
              onClick={() => navigate('/payments')}
              className="gap-2 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={currentPath === '/payments'}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
              <span className="sm:hidden">Pay</span>
            </Button>
            <Button
              variant={currentPath === '/leaderboard' ? 'default' : 'ghost'}
              onClick={() => navigate('/leaderboard')}
              className="gap-2 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={currentPath === '/leaderboard'}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
              <span className="sm:hidden">Board</span>
            </Button>
            <Button
              variant={currentPath === '/admin' ? 'default' : 'ghost'}
              onClick={() => navigate('/admin')}
              className="gap-2 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              data-active={currentPath === '/admin'}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">Adm</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Winner Section */}
        <section>
          <WinnerCard players={players} currentGameweek={currentGameweek} />
        </section>

        {/* Info Slider */}
        <section>
          <InfoSlider />
        </section>

        {/* Page Content */}
        {currentPath === '/' && <Players players={players} currentGameweek={currentGameweek} winner={winner} />}
        {currentPath === '/payments' && <Payments players={players} onUpdatePayment={updatePayment} />}
        {currentPath === '/leaderboard' && <LeaderboardPage players={players} />}
        {currentPath === '/admin' && <Admin players={players} currentGameweek={currentGameweek} onGameweekChange={onGameweekChange} onUpdateGameweekData={updateGameweekData} onDeleteManager={deleteManager} />}

        {/* Stats Footer */}
        <footer className="pt-8 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-4">
              <div className="text-xl sm:text-2xl font-orbitron font-bold gradient-text">11</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Participants</div>
            </div>
            <div className="p-2 sm:p-4">
              <div className="text-xl sm:text-2xl font-orbitron font-bold gradient-text">38</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Gameweeks</div>
            </div>
            <div className="p-2 sm:p-4">
              <div className="text-xl sm:text-2xl font-orbitron font-bold gradient-text">1,100</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Prize per GW</div>
            </div>
            <div className="p-2 sm:p-4">
              <div className="text-xl sm:text-2xl font-orbitron font-bold gradient-text">
                {players.reduce((sum, p) => sum + p.wins, 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Wins</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
