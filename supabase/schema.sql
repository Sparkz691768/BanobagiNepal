-- 1. users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  role text default 'customer',
  employee_id text unique,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- 3. products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  original_price numeric,
  images text[] default '{}',
  category_id uuid references categories(id),
  stock int default 0,
  is_active boolean default true,
  is_featured boolean default false,
  rating numeric default 0,
  review_count int default 0,
  created_at timestamptz default now()
);

-- 4. orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  items jsonb not null,
  total_amount numeric not null,
  status text default 'pending',
  payment_status text default 'unpaid',
  shipping_name text,
  shipping_email text,
  shipping_phone text,
  shipping_address text,
  shipping_city text,
  shipping_notes text,
  assigned_to uuid references users(id),
  delivery_partner text default 'nepal_can',
  delivery_assigned_at timestamptz,
  created_at timestamptz default now()
);

-- 5. order_items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity int not null,
  price numeric not null
);

-- 6. reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  user_id uuid references users(id),
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  unique(product_id, user_id)
);

-- 7. chats
create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  sender_id uuid references users(id),
  sender_role text not null,
  message text,
  attachment_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 8. verification_tokens  (email OTP + password reset)
create table if not exists verification_tokens (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text not null,
  type text not null,           -- 'email_verification' | 'password_reset'
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

-- index for fast look-ups
create index if not exists idx_vt_email_type on verification_tokens(email, type);

-- Enable Realtime
alter publication supabase_realtime add table chats;
alter publication supabase_realtime add table orders;
