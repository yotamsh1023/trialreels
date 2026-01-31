-- Add GetLate profile/account IDs for Instagram OAuth
alter table public.instagram_accounts
  add column if not exists late_profile_id text,
  add column if not exists late_account_id text;

comment on column public.instagram_accounts.late_profile_id is 'GetLate (Late) API profile _id';
comment on column public.instagram_accounts.late_account_id is 'GetLate (Late) API account _id for posting';
