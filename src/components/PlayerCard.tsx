import { Trophy, CreditCard, Check, AlertTriangle } from 'lucide-react';
import { Player } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlayerCardProps {
  player: Player;
  isWinner?: boolean;
  position: number;
}

export const PlayerCard = ({ player, isWinner = false, position }: PlayerCardProps) => {
  const getPerformanceColor = (netPoints: number) => {
    const maxPoints = Math.max(...[player.netPoints]); // You'd calculate this globally
    const percentage = maxPoints > 0 ? (netPoints / maxPoints) * 100 : 0;
    
    if (percentage >= 80) return 'performance-excellent';
    if (percentage >= 60) return 'performance-good';
    if (percentage >= 40) return 'performance-average';
    return 'performance-poor';
  };

  const getPaymentStatus = () => {
    if (player.gameweeksPaid >= 38) return 'paid';
    if (player.gameweeksPaid > 0) return 'partial';
    return 'overdue';
  };

  const getPaymentStatusColor = () => {
    const status = getPaymentStatus();
    switch (status) {
      case 'paid': return 'text-payment-paid';
      case 'partial': return 'text-payment-partial';
      case 'overdue': return 'text-payment-overdue';
    }
  };

  const getPaymentIcon = () => {
    const status = getPaymentStatus();
    switch (status) {
      case 'paid': return <Check className="w-4 h-4" />;
      case 'partial': return <AlertTriangle className="w-4 h-4" />;
      case 'overdue': return <CreditCard className="w-4 h-4" />;
    }
  };

  const recentGameweeks = player.gameweekHistory.slice(-3);

  return (
    <Card className={`p-6 h-80 hover-lift ${
      isWinner ? 'bg-gradient-to-br from-winner to-winner-glow border-winner winner-pulse' : 'bg-card'
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

      <div className="space-y-3 mb-4">
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

      {/* Payment Status Section */}
      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Payment Status</span>
          <div className={`flex items-center gap-1 ${getPaymentStatusColor()}`}>
            {getPaymentIcon()}
            <span className="text-xs font-medium capitalize">{getPaymentStatus()}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Paid: KSh {player.amountPaid.toLocaleString()}</span>
            <span className="text-muted-foreground">{player.gameweeksPaid}/38 GWs</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                getPaymentStatus() === 'paid' ? 'bg-payment-paid' :
                getPaymentStatus() === 'partial' ? 'bg-payment-partial' : 'bg-payment-overdue'
              }`}
              style={{ width: `${Math.min((player.gameweeksPaid / 38) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};