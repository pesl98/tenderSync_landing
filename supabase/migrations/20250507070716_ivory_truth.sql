/*
  # Fix Trial Subscriptions RLS

  1. Changes
    - Add RLS policy to allow public (unauthenticated) users to insert trial subscriptions
    - Keep existing policies for admin management and user access

  2. Security
    - Enable RLS on table (already enabled)
    - Add policy for public inserts
    - Maintain existing policies for admin management and user access
*/

-- Add policy to allow public users to insert trial subscriptions
CREATE POLICY "Allow public to insert trial subscriptions"
ON public.t_trial_subscriptions
FOR INSERT
TO public
WITH CHECK (true);