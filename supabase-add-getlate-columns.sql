-- Run this in Supabase SQL Editor if you get "Could not find late_account_id" error
-- Adds GetLate columns to existing instagram_accounts table

alter table public.instagram_accounts
  add column if not exists late_profile_id text,
  add column if not exists late_account_id text;
