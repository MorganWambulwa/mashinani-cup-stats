import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

interface Payment {
  id: string;
  manager_name: string;
  phone_number: string;
  amount: number;
  status: string;
  created_at: string;
  completed_at?: string;
  mpesa_receipt_number?: string;
}

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching payments:', error);
        return;
      }

      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-500",
      completed: "bg-green-500",
      failed: "bg-red-500",
      cancelled: "bg-gray-500"
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-500"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading payment history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-muted-foreground">No payments found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manager</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.manager_name}</TableCell>
                  <TableCell>KSh {payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {payment.mpesa_receipt_number || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}