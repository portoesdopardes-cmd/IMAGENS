-- Portões do PARDeS schema
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  level integer not null default 1,
  xp integer not null default 0,
  sparks integer not null default 0,
  hearts integer not null default 613 check (hearts >= 0 and hearts <= 613),
  inventory jsonb not null default '{"stickers":[],"merits":[],"powerups":{}}'::jsonb,
  portal_stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stickers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_he text,
  description text not null,
  category text not null,
  rarity text not null check (rarity in ('Comum','Rara','Épica','Lendária','Mítica')),
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name_pt text not null,
  name_he text,
  start_date date not null,
  end_date date not null,
  description text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.shop_items (
  id uuid primary key default gen_random_uuid(),
  name_pt text not null,
  description text not null,
  price integer not null check (price >= 0),
  type text not null,
  effect text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.merits (
  id uuid primary key default gen_random_uuid(),
  name_pt text not null,
  description text not null,
  trigger_type text not null,
  target_amount integer not null default 1,
  reward_xp integer not null default 0,
  reward_sparks integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.stickers enable row level security;
alter table public.events enable row level security;
alter table public.shop_items enable row level security;
alter table public.merits enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can upsert own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Authenticated can read stickers" on public.stickers
  for select using (auth.role() = 'authenticated');

create policy "Authenticated can read events" on public.events
  for select using (auth.role() = 'authenticated');

create policy "Authenticated can read shop_items" on public.shop_items
  for select using (auth.role() = 'authenticated');

create policy "Authenticated can read merits" on public.merits
  for select using (auth.role() = 'authenticated');
