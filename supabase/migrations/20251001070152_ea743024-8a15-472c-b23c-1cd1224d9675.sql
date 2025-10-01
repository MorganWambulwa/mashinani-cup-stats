-- ============================================
-- SECURITY FIX: Restrict access to payments table
-- ============================================

-- 1. Drop the insecure public SELECT policy
DROP POLICY IF EXISTS "Anyone can view payments" ON public.payments;

-- 2. Create a secure function to get payment history (without phone numbers)
CREATE OR REPLACE FUNCTION public.get_payment_history(limit_count integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  manager_name text,
  amount numeric,
  status text,
  created_at timestamptz,
  completed_at timestamptz,
  mpesa_receipt_number text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    manager_name,
    amount,
    status,
    created_at,
    completed_at,
    mpesa_receipt_number
  FROM public.payments
  ORDER BY created_at DESC
  LIMIT limit_count;
$$;

-- 3. Create a function to get payment statistics (for prize pool)
CREATE OR REPLACE FUNCTION public.get_payment_stats()
RETURNS TABLE (
  total_collected numeric,
  total_payments bigint,
  completed_payments bigint,
  pending_payments bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(SUM(amount), 0) as total_collected,
    COUNT(*) as total_payments,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_payments,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_payments
  FROM public.payments;
$$;

-- 4. Grant execute permissions on these functions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_payment_history(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_payment_stats() TO anon, authenticated;

-- 5. Add comment explaining the security model
COMMENT ON FUNCTION public.get_payment_history IS 'Returns payment history without sensitive phone numbers - safe for public display';
COMMENT ON FUNCTION public.get_payment_stats IS 'Returns aggregated payment statistics without sensitive data';