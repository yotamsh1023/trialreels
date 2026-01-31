-- Original Instagram post date (for display and filtering)
alter table public.user_posts
  add column if not exists posted_at timestamptz;

create index if not exists user_posts_posted_at_idx on public.user_posts(posted_at);
