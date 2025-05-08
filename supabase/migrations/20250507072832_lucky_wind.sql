/*
  # Add source_app field to trial subscriptions table

  1. Changes
    - Add source_app column to t_trial_subscriptions table with default value 'TenderSync'
    - Update existing rows to have the default value
*/

-- Add the new column with default value
ALTER TABLE t_trial_subscriptions
ADD COLUMN source_app text NOT NULL DEFAULT 'TenderSync';

-- Update any existing rows to have the default value
UPDATE t_trial_subscriptions
SET source_app = 'TenderSync'
WHERE source_app IS NULL;