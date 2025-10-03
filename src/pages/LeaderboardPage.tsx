import { Leaderboard } from '@/components/Leaderboard';
import { Player } from '@/types';

interface LeaderboardPageProps {
  players: Player[];
}

const LeaderboardPage = ({ players }: LeaderboardPageProps) => {
  return (
    <section className="space-y-6">
      <Leaderboard players={players} />
    </section>
  );
};

export default LeaderboardPage;
