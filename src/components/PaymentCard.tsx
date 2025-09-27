import { useState } from 'react';
import { CreditCard, Check, AlertTriangle, Banknote } from 'lucide-react';
import { Player } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface PaymentCardProps {
  player: Player;
  onUpdatePayment: (manager: string, amount: number) => void;
}

export const PaymentCard = ({ player, onUpdatePayment }: PaymentCardProps) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('100');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const getPaymentStatus = () => {
    if (player.gameweeksPaid >= 38) return 'paid';
    if (player.gameweeksPaid > 0) return 'partial';
    return 'overdue';
  };

  const getStatusColor = () => {
    const status = getPaymentStatus();
    switch (status) {
      case 'paid': return 'bg-payment-paid';
      case 'partial': return 'bg-payment-partial';
      case 'overdue': return 'bg-payment-overdue';
    }
  };

  const getStatusIcon = () => {
    const status = getPaymentStatus();
    switch (status) {
      case 'paid': return <Check className="w-4 h-4" />;
      case 'partial': return <AlertTriangle className="w-4 h-4" />;
      case 'overdue': return <CreditCard className="w-4 h-4" />;
    }
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber || !amount || !pin) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (pin !== '1234') {
      toast({
        title: "Invalid PIN",
        description: "Incorrect PIN entered",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentAmount = parseInt(amount);
      onUpdatePayment(player.manager, paymentAmount);
      
      toast({
        title: "Payment Successful",
        description: `KSh ${paymentAmount} paid successfully via M-Pesa`,
      });

      setIsPaymentDialogOpen(false);
      setPin('');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Card className="p-4 hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <h3 className="font-semibold text-sm">{player.manager}</h3>
        </div>
        {getStatusIcon()}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Amount Paid</span>
          <span className="font-semibold">KSh {player.amountPaid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Gameweeks Paid</span>
          <span className="font-semibold">{player.gameweeksPaid}/38</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${getStatusColor()}`}
            style={{ width: `${Math.min((player.gameweeksPaid / 38) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={getPaymentStatus() === 'paid' ? 'default' : 'secondary'}>
          {getPaymentStatus() === 'paid' ? 'Fully Paid' : 
           getPaymentStatus() === 'partial' ? 'Partial' : 'Outstanding'}
        </Badge>

        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Banknote className="w-4 h-4" />
              Pay
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                M-Pesa Payment - {player.manager}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="254700000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (KSh)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  KSh 100 = 1 gameweek
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin">M-Pesa PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                />
                <p className="text-xs text-muted-foreground">
                  Sandbox PIN: 1234
                </p>
              </div>
              
              <Button 
                onClick={handleMpesaPayment} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : `Pay KSh ${amount}`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};