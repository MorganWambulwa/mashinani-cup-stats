-- Update payment functions to require admin role (policies already updated)

-- Update get_payment_history function to require admin role
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

-- Update get_payment_stats function to require admin role
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