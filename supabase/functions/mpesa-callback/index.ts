import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MpesaCallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('M-Pesa callback received');
    
    const callbackData: MpesaCallbackData = await req.json();
    console.log('Callback data:', JSON.stringify(callbackData, null, 2));

    const { stkCallback } = callbackData.Body;
    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    // Find the payment record
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .single();

    if (fetchError) {
      console.error('Error fetching payment:', fetchError);
      return new Response(JSON.stringify({ error: 'Payment not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update payment status based on result code
    let updateData: any = {
      completed_at: new Date().toISOString(),
    };

    if (ResultCode === 0) {
      // Payment successful
      updateData.status = 'completed';
      
      // Extract callback metadata
      if (stkCallback.CallbackMetadata?.Item) {
        const metadata = stkCallback.CallbackMetadata.Item;
        
        const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
        const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;
        const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
        
        updateData.mpesa_receipt_number = mpesaReceiptNumber;
        updateData.mpesa_transaction_id = mpesaReceiptNumber;
        updateData.transaction_desc = `Payment from ${phoneNumber} on ${transactionDate}`;
      }

      console.log('Payment successful for CheckoutRequestID:', CheckoutRequestID);
      
      // Update the league season prize pool
      const { data: activeSeason } = await supabase
        .from('league_seasons')
        .select('total_prize_pool')
        .eq('is_active', true)
        .single();

      if (activeSeason) {
        const { error: prizePoolError } = await supabase
          .from('league_seasons')
          .update({
            total_prize_pool: activeSeason.total_prize_pool + payment.amount
          })
          .eq('is_active', true);

        if (prizePoolError) {
          console.error('Error updating prize pool:', prizePoolError);
        }
      }

    } else {
      // Payment failed or cancelled
      updateData.status = ResultCode === 1032 ? 'cancelled' : 'failed';
      updateData.transaction_desc = ResultDesc;
      console.log('Payment failed/cancelled for CheckoutRequestID:', CheckoutRequestID, 'Reason:', ResultDesc);
    }

    // Update the payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', payment.id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update payment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Payment updated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Callback processed successfully' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});