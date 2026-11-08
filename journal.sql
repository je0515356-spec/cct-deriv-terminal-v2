-- CCT Trading Journal: idempotent setup. Does not alter existing watchlists.
create table if not exists public.trades (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 market text not null,
 side text not null check (side in ('BUY','SELL')),
 entry_price numeric not null check (entry_price > 0),
 exit_price numeric,
 result numeric not null default 0,
 notes text not null default '',
 trade_date timestamptz not null default now(),
 created_at timestamptz not null default now()
);
create index if not exists trades_user_date_idx on public.trades(user_id, trade_date desc);
alter table public.trades enable row level security;
drop policy if exists "Members can read own trades" on public.trades;
drop policy if exists "Members can insert own trades" on public.trades;
drop policy if exists "Members can update own trades" on public.trades;
drop policy if exists "Members can delete own trades" on public.trades;
create policy "Members can read own trades" on public.trades for select to authenticated using (auth.uid() = user_id);
create policy "Members can insert own trades" on public.trades for insert to authenticated with check (auth.uid() = user_id);
create policy "Members can update own trades" on public.trades for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Members can delete own trades" on public.trades for delete to authenticated using (auth.uid() = user_id);
grant select, insert, update, delete on public.trades to authenticated;
notify pgrst, 'reload schema';
