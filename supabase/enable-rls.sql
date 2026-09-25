-- Enable Row Level Security on every table.
--
-- The app talks to Supabase only from the server with the SERVICE ROLE key,
-- which bypasses RLS, so the site keeps working exactly the same.
-- With RLS on and no policies, the public ANON key (which was shipped to the
-- browser in earlier builds) can no longer read users' password hashes,
-- orders, chats or password-reset / OTP tokens.
--
-- Run once in Supabase Dashboard → SQL Editor.

alter table if exists public.users                  enable row level security;
alter table if exists public.categories             enable row level security;
alter table if exists public.products               enable row level security;
alter table if exists public.orders                 enable row level security;
alter table if exists public.order_items            enable row level security;
alter table if exists public.reviews                enable row level security;
alter table if exists public.chats                  enable row level security;
alter table if exists public.verification_tokens    enable row level security;
alter table if exists public.settings               enable row level security;
alter table if exists public.newsletter_subscribers enable row level security;

-- Realtime is no longer used by the app (chat polls the API instead).
do $$
begin
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chats') then
    alter publication supabase_realtime drop table public.chats;
  end if;
  if exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'orders') then
    alter publication supabase_realtime drop table public.orders;
  end if;
end $$;

-- Optional housekeeping: remove expired tokens / rate-limit rows
delete from public.verification_tokens where expires_at < now() - interval '1 day';
