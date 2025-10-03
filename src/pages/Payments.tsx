import { PaymentCard } from '@/components/PaymentCard';
import { PaymentHistory } from '@/components/PaymentHistory';
import { PrizePool } from '@/components/PrizePool';
import { Player } from '@/types';

interface PaymentsProps {
  players: Player[];
  onUpdatePayment: (manager: string, amount: number) => Promise<void>;
}

const Payments = ({ players, onUpdatePayment }: PaymentsProps) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="font-orbitron text-xl sm:text-2xl font-bold">Payment Management</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">KSh 100 per gameweek • Total: KSh 3,800</p>
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
            onUpdatePayment={onUpdatePayment}
          />
        ))}
      </div>
    </section>
  );
};

export default Payments;
