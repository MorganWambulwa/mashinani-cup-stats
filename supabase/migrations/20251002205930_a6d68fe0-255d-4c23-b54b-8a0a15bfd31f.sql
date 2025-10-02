-- Create players table
CREATE TABLE IF NOT EXISTS public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager TEXT NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  transfer_points INTEGER NOT NULL DEFAULT 0,
  net_points INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  gameweeks_paid INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gameweek_data table
CREATE TABLE IF NOT EXISTS public.gameweek_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  gameweek INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  transfer_points INTEGER NOT NULL DEFAULT 0,
  net_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(player_id, gameweek)
);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gameweek_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view players"
ON public.players
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view gameweek data"
ON public.gameweek_data
FOR SELECT
USING (true);

-- Create policies for system management
CREATE POLICY "System can manage players"
ON public.players
FOR ALL
USING (true);

CREATE POLICY "System can manage gameweek data"
ON public.gameweek_data
FOR ALL
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gameweek_data_updated_at
BEFORE UPDATE ON public.gameweek_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial participants
INSERT INTO public.players (manager) VALUES
  ('Wantam All-Stars'),
  ('Kalambwanda'),
  ('Dr. Naisi'),
  ('Destroyers'),
  ('Wakudumu Tutadumu'),
  ('The Gladiators'),
  ('Zesko'),
  ('@Well'),
  ('Gobo Fc'),
  ('Not in tittle race'),
  ('Bongo Boys')
ON CONFLICT (manager) DO NOTHING;