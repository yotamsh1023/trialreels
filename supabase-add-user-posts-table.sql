-- Run this in Supabase SQL Editor if you need only the user_posts table
-- (Otherwise run supabase-schema.sql or migrations.)

create table if not exists public.user_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id text not null,
  thumbnail_url text,
  caption text,
  video_url text,
  media_type text default 'video',
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

create index if not exists user_posts_user_id_idx on public.user_posts(user_id);

alter table public.user_posts enable row level security;

create policy "Users can manage own user_posts"
  on public.user_posts for all
  using (auth.uid() = user_id);
