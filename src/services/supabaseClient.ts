import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { JournalTrade, JournalAccount } from '../types/journal';
import { Drawing } from '../types/drawing';

// Default Supabase project URL from user configuration
const DEFAULT_SUPABASE_URL = 'https://khcqjwcmqcsjjscebcxj.supabase.co';

export const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('cct_supabase_url') || DEFAULT_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('cct_supabase_anon_key') || '';
  return { url, anonKey };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!anonKey) {
    return null;
  }
  if (!clientInstance) {
    try {
      clientInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
      return null;
    }
  }
  return clientInstance;
};

export const resetSupabaseClient = () => {
  clientInstance = null;
};

// Google OAuth Login
export const signInWithGoogle = async () => {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase anon key is not configured. Please configure it in Database Settings.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('cct_user_session');
};

// Database idempotent SQL script for user convenience
export const SQL_MIGRATION_SCRIPT = `-- =========================================================================
-- CCT (CROWN COME TRADER) V9.0 FINAL - SUPABASE IDEMPOTENT SQL MIGRATION
-- Tables: profiles, watchlists, journal_accounts, journal_trades, trading_drawings
-- Full Row Level Security (RLS) included
-- =========================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can view own profile') then
    create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert own profile') then
    create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- 2. WATCHLISTS TABLE
create table if not exists public.watchlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  symbol text not null,
  market text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, symbol)
);

alter table public.watchlists enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'watchlists' and policyname = 'Users manage own watchlists') then
    create policy "Users manage own watchlists" on public.watchlists for all using (auth.uid() = user_id);
  end if;
end $$;

-- 3. JOURNAL ACCOUNTS TABLE
create table if not exists public.journal_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null default 'Compte Principal',
  currency text not null default 'USD',
  initial_balance numeric not null default 10000,
  current_balance numeric not null default 10000,
  deposits numeric not null default 0,
  withdrawals numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.journal_accounts enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'journal_accounts' and policyname = 'Users manage own accounts') then
    create policy "Users manage own accounts" on public.journal_accounts for all using (auth.uid() = user_id);
  end if;
end $$;

-- 4. JOURNAL TRADES TABLE
create table if not exists public.journal_trades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  account_id uuid references public.journal_accounts on delete set null,
  date text not null,
  market text not null,
  symbol text not null,
  direction text not null,
  entry_price numeric not null,
  stop_loss_price numeric not null,
  take_profit_price numeric not null,
  exit_price numeric,
  volume numeric not null default 1,
  risk_amount numeric not null default 100,
  pnl numeric not null default 0,
  pnl_r numeric not null default 0,
  strategy text not null default 'Discretionary',
  status text not null default 'OPEN',
  screenshot_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.journal_trades enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'journal_trades' and policyname = 'Users manage own trades') then
    create policy "Users manage own trades" on public.journal_trades for all using (auth.uid() = user_id);
  end if;
end $$;

-- 5. TRADING DRAWINGS TABLE
create table if not exists public.trading_drawings (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  symbol text not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trading_drawings enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'trading_drawings' and policyname = 'Users manage own drawings') then
    create policy "Users manage own drawings" on public.trading_drawings for all using (auth.uid() = user_id);
  end if;
end $$;
`;

// Helper for drawings persistence
export const loadDrawingsForSymbol = async (symbol: string): Promise<Drawing[]> => {
  const localKey = `cct_drawings_${symbol}`;
  const localData = localStorage.getItem(localKey);
  const localDrawings: Drawing[] = localData ? JSON.parse(localData) : [];

  const supabase = getSupabase();
  if (!supabase) return localDrawings;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return localDrawings;

    const { data, error } = await supabase
      .from('trading_drawings')
      .select('data')
      .eq('user_id', user.id)
      .eq('symbol', symbol);

    if (error || !data) return localDrawings;
    const remoteDrawings = data.map((row) => row.data as Drawing);
    return remoteDrawings.length > 0 ? remoteDrawings : localDrawings;
  } catch {
    return localDrawings;
  }
};

export const saveDrawingsForSymbol = async (symbol: string, drawings: Drawing[]): Promise<void> => {
  const localKey = `cct_drawings_${symbol}`;
  localStorage.setItem(localKey, JSON.stringify(drawings));

  const supabase = getSupabase();
  if (!supabase) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Delete existing drawings for this user and symbol, then insert new batch
    await supabase
      .from('trading_drawings')
      .delete()
      .eq('user_id', user.id)
      .eq('symbol', symbol);

    if (drawings.length > 0) {
      const rows = drawings.map((d) => ({
        id: `${user.id}_${symbol}_${d.id}`,
        user_id: user.id,
        symbol,
        data: d,
        updated_at: new Date().toISOString(),
      }));
      await supabase.from('trading_drawings').insert(rows);
    }
  } catch (err) {
    console.warn('Could not sync drawings to Supabase:', err);
  }
};
