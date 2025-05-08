/*
  # Create trial subscriptions table

  1. New Tables
    - `t_trial_subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `name` (text, not null)
      - `telephone` (text)
      - `company_name` (text, not null)
      - `company_description` (text, not null)
      - `approved` (boolean, default false)
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `t_trial_subscriptions` table
    - Add policy for authenticated users to read their own data
    - Add policy for admins to manage all records
*/

CREATE TABLE t_trial_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  telephone text,
  company_name text NOT NULL,
  company_description text NOT NULL,
  approved boolean DEFAULT false,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE t_trial_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own trial subscriptions"
  ON t_trial_subscriptions
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

CREATE POLICY "Admins can manage all trial subscriptions"
  ON t_trial_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );