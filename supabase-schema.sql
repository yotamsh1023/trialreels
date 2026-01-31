-- Run this in Supabase SQL Editor to create tables for Reels AutoPoster

-- Instagram accounts linked to auth users
create table if not exists public.instagram_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  instagram_id text,
  username text,
  late_profile_id text,
  late_account_id text,
  rapidapi_ig_id text,
  reels_next_max_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.instagram_accounts enable row level security;

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

create policy "Users can manage own selected_posts"
  on public.selected_posts for all
  using (auth.uid() = user_id);

-- Scraped Instagram posts (videos only) per user for Post Selection
create table if not exists public.user_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id text not null,
  thumbnail_url text,
  caption text,
  video_url text,
  media_type text default 'video',
  posted_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

create index if not exists user_posts_user_id_idx on public.user_posts(user_id);
create index if not exists user_posts_posted_at_idx on public.user_posts(posted_at);

alter table public.user_posts enable row level security;

create policy "Users can manage own user_posts"
  on public.user_posts for all
  using (auth.uid() = user_id);
