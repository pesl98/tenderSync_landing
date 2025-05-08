/*
  # Add unique constraint to t_trial_subscriptions email
  
  1. Changes
    - Remove duplicate emails by keeping only the most recent entry
    - Add unique constraint on email column
  
  2. Notes
    - Preserves the most recent trial subscription for each email
    - Ensures data integrity for future entries
*/

-- First, create a temporary table to store the entries we want to keep
CREATE TEMP TABLE temp_trial_subs AS
SELECT DISTINCT ON (email) *
FROM t_trial_subscriptions
ORDER BY email, created_at DESC;

-- Delete all rows from the original table
DELETE FROM t_trial_subscriptions;

-- Reinsert the deduplicated rows
INSERT INTO t_trial_subscriptions
SELECT * FROM temp_trial_subs;

-- Drop the temporary table
DROP TABLE temp_trial_subs;

-- Now we can safely add the unique constraint
ALTER TABLE t_trial_subscriptions
ADD CONSTRAINT t_trial_subscriptions_email_unique UNIQUE (email);