import { Button } from '@/components/ui/button';
import { GameweekForm } from '@/components/GameweekForm';
import { Player } from '@/types';

interface AdminProps {
  players: Player[];
  currentGameweek: number;
  onGameweekChange: (gameweek: number) => void;
  onUpdateGameweekData: (gameweek: number, data: Record<string, { points: number; transferPoints: number }>) => Promise<void>;
  onDeleteManager: (manager: string) => Promise<void>;
}

const Admin = ({ 
  players, 
  currentGameweek, 
  onGameweekChange, 
  onUpdateGameweekData, 
  onDeleteManager 
}: AdminProps) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-orbitron text-xl sm:text-2xl font-bold">Admin Panel</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Update gameweek scores and manage the league</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGameweekChange(Math.max(1, currentGameweek - 1))}
            disabled={currentGameweek <= 1}
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Previous GW</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGameweekChange(Math.min(38, currentGameweek + 1))}
            disabled={currentGameweek >= 38}
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Next GW</span>
            <span className="sm:hidden">Next</span>
          </Button>
        </div>
      </div>
      
      <GameweekForm 
        players={players} 
        onUpdateGameweekData={onUpdateGameweekData}
        onDeleteManager={onDeleteManager}
        currentGameweek={currentGameweek}
        onGameweekChange={onGameweekChange}
      />
    </section>
  );
};

export default Admin;
