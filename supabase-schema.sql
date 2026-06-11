-- NOVA Store Pro Supabase schema
-- Run this in Supabase SQL Editor.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  category text not null,
  price numeric(10,3) not null,
  old_price numeric(10,3),
  discount boolean default false,
  stock_qty integer default 0,
  type text default 'case',
  description text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  phone text not null,
  address text not null,
  notes text,
  total numeric(10,3) not null,
  items jsonb not null,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Products are public readable" on public.products;
create policy "Products are public readable"
on public.products for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert products" on public.products;
create policy "Authenticated can insert products"
on public.products for insert
to authenticated
with check (true);

drop policy if exists "Users can insert orders" on public.orders;
create policy "Users can insert orders"
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists "Users can read own orders or guest local only" on public.orders;
create policy "Users can read own orders or guest local only"
on public.orders for select
to authenticated
using (auth.uid() = user_id);

insert into public.products (name,brand,category,price,old_price,discount,stock_qty,type,description)
values
('ASUS ROG RTX 5080','ASUS','Graphics',429.900,507.282,true,3,'gpu','High-end graphics card for elite gaming builds.'),
('MSI RTX 4070 Super','MSI','Graphics',219.900,249.900,true,12,'gpu','Great 1440p gaming graphics card.'),
('Ryzen 7 9800X3D','AMD','Processor',189.900,null,false,9,'cpu','Gaming CPU with excellent performance.'),
('Samsung 990 Pro 2TB','Samsung','Storage',59.900,70.682,true,15,'ram','Fast NVMe storage.'),
('G.Skill DDR5 32GB','G.Skill','RAM',44.900,52.982,true,3,'ram','Fast DDR5 memory.'),
('Lian Li O11 EVO RGB','Lian Li','Case',49.900,null,false,3,'case','Premium RGB case.'),
('Samsung Odyssey 27','Samsung','Monitor',119.900,141.482,true,10,'monitor','Gaming monitor for smooth visuals.')
on conflict do nothing;
