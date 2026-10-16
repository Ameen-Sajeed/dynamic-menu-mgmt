-- Run this if the original schema was already applied before the laundry update.
alter table public.products add column if not exists press_price text;
alter table public.products add column if not exists wash_press_price text;
alter table public.products add column if not exists dry_clean_price text;
