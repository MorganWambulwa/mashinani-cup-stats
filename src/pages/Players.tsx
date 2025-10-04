import { PlayerCard } from '@/components/PlayerCard';
import { Player } from '@/types';

interface PlayersProps {
  players: Player[];
  currentGameweek: number;
  winner: Player | null;
}

const Players = ({ players, currentGameweek, winner }: PlayersProps) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold">All Managers</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Click cards to flip and see recent performance</p>
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
    </section>
  );
};

export default Players;
