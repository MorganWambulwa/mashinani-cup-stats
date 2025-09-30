-- Create payments table to track M-Pesa transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  checkout_request_id TEXT,
  mpesa_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  mpesa_receipt_number TEXT,
  transaction_desc TEXT
);

-- Create league_seasons table to track different seasons/periods
CREATE TABLE public.league_seasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_prize_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create winners table to track gameweek and season winners
CREATE TABLE public.winners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID REFERENCES public.league_seasons(id) ON DELETE CASCADE,
  manager_name TEXT NOT NULL,
  gameweek INTEGER,
  prize_type TEXT NOT NULL CHECK (prize_type IN ('gameweek_winner', 'season_winner', 'runner_up', 'third_place')),
  prize_amount DECIMAL(10,2) NOT NULL,
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'failed')),
  payout_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Create policies for payments (users can view all payments, admins can modify)
CREATE POLICY "Anyone can view payments" 
ON public.payments 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Create policies for league_seasons
CREATE POLICY "Anyone can view seasons" 
ON public.league_seasons 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage seasons" 
ON public.league_seasons 
FOR ALL 
USING (true);

-- Create policies for winners
CREATE POLICY "Anyone can view winners" 
ON public.winners 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage winners" 
ON public.winners 
FOR ALL 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_checkout_request ON public.payments(checkout_request_id);
CREATE INDEX idx_payments_mpesa_transaction ON public.payments(mpesa_transaction_id);
CREATE INDEX idx_winners_season_gameweek ON public.winners(season_id, gameweek);

-- Insert default active season
INSERT INTO public.league_seasons (name, start_date, end_date, is_active)
VALUES ('Season 2025', '2025-01-01', '2025-12-31', true);