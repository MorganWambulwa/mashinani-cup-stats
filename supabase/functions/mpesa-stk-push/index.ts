import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  managerName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, amount, managerName }: STKPushRequest = await req.json();

    console.log('Processing M-Pesa STK Push for:', { phoneNumber, amount, managerName });

    // Validate inputs
    if (!phoneNumber || !amount || !managerName) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: phoneNumber, amount, managerName' 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Format phone number (ensure it starts with 254)
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // Get M-Pesa credentials from environment
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
    const passkey = Deno.env.get('MPESA_PASSKEY');

    if (!consumerKey || !consumerSecret || !passkey) {
      console.error('Missing M-Pesa credentials');
      return new Response(
        JSON.stringify({ error: 'M-Pesa credentials not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // M-Pesa API Configuration (Sandbox)
    const shortCode = '174379';
    const callbackUrl = 'https://your-app.com/mpesa-callback'; // You'll need to set this to your actual callback URL
    
    // Step 1: Get OAuth token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenResponse = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token request failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to get M-Pesa token' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = btoa(shortCode + passkey + timestamp);

    // Step 3: Initiate STK Push
    const stkPushPayload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: `MashinaniLeague-${managerName}`,
      TransactionDesc: `Payment for Mashinani League - ${managerName}`,
    };

    console.log('Sending STK Push request:', { ...stkPushPayload, Password: '[HIDDEN]' });

    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPushPayload),
      }
    );

    const stkData = await stkResponse.json();
    
    console.log('STK Push response:', stkData);

    if (stkData.ResponseCode === '0') {
      // Success - STK push sent to user's phone
      return new Response(
        JSON.stringify({
          success: true,
          message: 'STK push sent successfully. Please check your phone to complete payment.',
          checkoutRequestId: stkData.CheckoutRequestID,
          merchantRequestId: stkData.MerchantRequestID,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    } else {
      // Error from M-Pesa
      console.error('STK Push failed:', stkData);
      return new Response(
        JSON.stringify({
          success: false,
          error: stkData.ResponseDescription || 'STK push failed',
          details: stkData,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

  } catch (error: any) {
    console.error('Error in M-Pesa STK Push function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);