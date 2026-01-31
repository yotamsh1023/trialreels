-- Instagram accounts linked to auth users
create table if not exists public.instagram_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  instagram_id text,
  username text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.instagram_accounts enable row level security;

drop policy if exists "Users can manage own instagram_accounts" on public.instagram_accounts;
create policy "Users can manage own instagram_accounts"
  on public.instagram_accounts for all
  using (auth.uid() = user_id);

-- Selected post IDs per user (for daily repost via GetLate API)
create table if not exists public.selected_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id text not null,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

alter table public.selected_posts enable row level security;

drop policy if exists "Users can manage own selected_posts" on public.selected_posts;
create policy "Users can manage own selected_posts"
  on public.selected_posts for all
  using (auth.uid() = user_id);
