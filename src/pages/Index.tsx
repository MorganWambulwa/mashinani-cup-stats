import { useState } from 'react';
import { Trophy, Settings, BarChart3, Users, CreditCard, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loading = false;

  const navItems = [
    { path: '/', label: 'Players', shortLabel: 'Play', icon: Users },
    { path: '/payments', label: 'Payments', shortLabel: 'Pay', icon: CreditCard },
    { path: '/leaderboard', label: 'Leaderboard', shortLabel: 'Board', icon: BarChart3 },
    { path: '/admin', label: 'Admin', shortLabel: 'Adm', icon: Settings },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

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
      <nav className="sticky top-[73px] sm:top-[81px] z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? 'default' : 'ghost'}
                onClick={() => navigate(item.path)}
                className="gap-2 rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
                data-active={currentPath === item.path}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-3">
              <h2 className="font-semibold">
                {navItems.find(item => item.path === currentPath)?.label || 'Menu'}
              </h2>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="pb-3 space-y-1 border-t border-border pt-3">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      currentPath === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
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
