-- Store RapidAPI Instagram numeric user ID (from user_id_by_username) for reuse
alter table public.instagram_accounts
  add column if not exists rapidapi_ig_id text;

comment on column public.instagram_accounts.rapidapi_ig_id is 'Instagram numeric user ID from RapidAPI user_id_by_username';
