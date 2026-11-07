-- Run in Supabase SQL editor. Watchlists are private to their owners.
create table if not exists public.watchlists (
 user_id uuid primary key references auth.users(id) on delete cascade,
 symbols text[] not null default '{}',
 updated_at timestamptz not null default now()
);
alter table public.watchlists enable row level security;
create policy "Users read own watchlist" on public.watchlists for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own watchlist" on public.watchlists for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own watchlist" on public.watchlists for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
