-- Store next-page cursor for reels pagination (updated each ~12 posts)
alter table public.instagram_accounts
  add column if not exists reels_next_max_id text;

comment on column public.instagram_accounts.reels_next_max_id is 'RapidAPI reels next page cursor (max_id); cleared when all pages loaded';
