-- Create role-based access control system for admin-only payment access

-- 1. Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 5. Create policy for admins to manage roles (will work after has_role function is created)
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 6. Create security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 7. Drop and recreate the SELECT policy on payments to require admin role
DROP POLICY IF EXISTS "Authenticated users can view payments" ON public.payments;

CREATE POLICY "Only admins can view payments"
ON public.payments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Update get_payment_history function to require admin role
DROP FUNCTION IF EXISTS public.get_payment_history(integer);

CREATE OR REPLACE FUNCTION public.get_payment_history(limit_count integer DEFAULT 50)
RETURNS TABLE(
  id uuid,
  manager_name text,
  amount numeric,
  status text,
  created_at timestamp with time zone,
  completed_at timestamp with time zone,
  mpesa_receipt_number text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is authenticated and has admin role
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to view payment history';
  END IF;

  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required to view payment history';
  END IF;

  -- Return payment data (only for admins)
  RETURN QUERY
  SELECT 
    p.id,
    p.manager_name,
    p.amount,
    p.status,
    p.created_at,
    p.completed_at,
    p.mpesa_receipt_number
  FROM public.payments p
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$;

-- 9. Update get_payment_stats function to require admin role
DROP FUNCTION IF EXISTS public.get_payment_stats();

CREATE OR REPLACE FUNCTION public.get_payment_stats()
RETURNS TABLE(
  total_collected numeric,
  total_payments bigint,
  completed_payments bigint,
  pending_payments bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is authenticated and has admin role
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to view payment statistics';
  END IF;

  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required to view payment statistics';
  END IF;

  -- Return payment statistics (only for admins)
  RETURN QUERY
  SELECT 
    COALESCE(SUM(amount), 0) as total_collected,
    COUNT(*) as total_payments,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_payments,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_payments
  FROM public.payments;
END;
$$;

-- NOTE: After this migration, you'll need to manually assign admin role to users
-- Example: INSERT INTO public.user_roles (user_id, role) VALUES ('<user_uuid>', 'admin');