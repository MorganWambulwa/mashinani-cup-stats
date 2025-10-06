-- Add SELECT policy for payments table to restrict access to authenticated users
-- This provides defense-in-depth alongside the secured functions

CREATE POLICY "Authenticated users can view payments"
ON public.payments
FOR SELECT
TO authenticated
USING (true);

-- Note: This allows authenticated users to view all payments
-- which is appropriate for admin/league management use case
-- The payments table doesn't have user_id, so we can't restrict to "own records"