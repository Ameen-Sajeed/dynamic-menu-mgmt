-- Run in the Supabase SQL editor. The first signed-in user becomes menu owner on creation.
create extension if not exists "pgcrypto";

create table public.menus (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'), business_name text not null,
  logo_url text, accent_color text not null default '#b45309' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  is_published boolean not null default false, published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), menu_id uuid not null references public.menus(id) on delete cascade,
  name text not null, description text, position integer not null default 0, created_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid not null references public.categories(id) on delete cascade,
  name text not null, description text, price numeric(10,2) not null check (price >= 0), label text, position integer not null default 0,
  is_available boolean not null default true, created_at timestamptz not null default now()
);
create index categories_menu_position on public.categories(menu_id, position);
create index products_category_position on public.products(category_id, position);

alter table public.menus enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
create policy "published menus are public" on public.menus for select using (is_published or owner_id = auth.uid());
create policy "owners manage menus" on public.menus for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "categories follow accessible menu" on public.categories for select using (exists (select 1 from public.menus m where m.id = menu_id and (m.is_published or m.owner_id = auth.uid())));
create policy "owners manage categories" on public.categories for all using (exists (select 1 from public.menus m where m.id = menu_id and m.owner_id = auth.uid())) with check (exists (select 1 from public.menus m where m.id = menu_id and m.owner_id = auth.uid()));
create policy "products follow accessible menu" on public.products for select using (exists (select 1 from public.categories c join public.menus m on m.id = c.menu_id where c.id = category_id and (m.is_published or m.owner_id = auth.uid())));
create policy "owners manage products" on public.products for all using (exists (select 1 from public.categories c join public.menus m on m.id = c.menu_id where c.id = category_id and m.owner_id = auth.uid())) with check (exists (select 1 from public.categories c join public.menus m on m.id = c.menu_id where c.id = category_id and m.owner_id = auth.uid()));

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger menus_updated_at before update on public.menus for each row execute function public.set_updated_at();
