create table roles (
  id bigserial primary key,
  name varchar(30) not null unique
);

create table users (
  id bigserial primary key,
  email varchar(120) not null unique,
  password_hash varchar(120) not null,
  role_id bigint not null references roles(id),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table refresh_tokens (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  token_hash varchar(255) not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table farmer_profiles (
  id bigserial primary key,
  user_id bigint not null unique references users(id) on delete cascade,
  full_name varchar(120) not null,
  farm_name varchar(140) not null,
  phone varchar(30) not null,
  town varchar(100) not null,
  region varchar(100) not null,
  bio varchar(500),
  avatar_url varchar(300),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id bigserial primary key,
  farmer_id bigint not null references farmer_profiles(id) on delete cascade,
  title varchar(160) not null,
  description varchar(700) not null,
  category varchar(80) not null,
  price numeric(14,2) not null,
  currency varchar(10) not null,
  quantity numeric(14,2) not null,
  unit varchar(30) not null,
  harvest_date date,
  location varchar(120) not null,
  availability_status varchar(30) not null,
  is_published boolean not null default false,
  moderation_status varchar(30) not null default 'PENDING',
  tags varchar(260),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id bigserial primary key,
  product_id bigint not null references products(id) on delete cascade,
  object_key varchar(320) not null,
  public_url varchar(400) not null,
  mime_type varchar(60) not null,
  size_bytes bigint not null,
  is_primary boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table orders (
  id bigserial primary key,
  buyer_id bigint not null references users(id) on delete cascade,
  product_id bigint not null references products(id) on delete cascade,
  farmer_user_id bigint not null references users(id) on delete cascade,
  quantity numeric(12,2) not null,
  note varchar(400),
  status varchar(30) not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table admin_product_moderation (
  id bigserial primary key,
  product_id bigint not null references products(id) on delete cascade,
  action varchar(30) not null,
  reason varchar(400),
  admin_id bigint not null references users(id),
  created_at timestamptz not null default now()
);

create index idx_products_category on products(category);
create index idx_products_location on products(location);
create index idx_products_harvest_date on products(harvest_date);
create index idx_products_published on products(is_published);
create index idx_products_moderation_status on products(moderation_status);
create index idx_orders_farmer on orders(farmer_user_id);
create index idx_orders_buyer on orders(buyer_id);

insert into roles(name) values ('ROLE_ADMIN'), ('ROLE_FARMER'), ('ROLE_BUYER');

-- password: Admin123!
insert into users(email, password_hash, role_id, enabled)
select 'admin@farmers.local',
       '$2a$10$8V7vLG9fRCHTUQ7fY4fT4e7N0M4j3N4hd9xONjM3YsNEnf2kD6Z3m',
       r.id,
       true
from roles r
where r.name = 'ROLE_ADMIN';
