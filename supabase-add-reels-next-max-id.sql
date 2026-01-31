-- Run this in Supabase SQL Editor if reels_next_max_id column is missing
-- (Error: column "reels_next_max_id" does not exist)

alter table public.instagram_accounts
  add column if not exists reels_next_max_id text;

comment on column public.instagram_accounts.reels_next_max_id is 'RapidAPI reels next page cursor (max_id); cleared when all pages loaded';
