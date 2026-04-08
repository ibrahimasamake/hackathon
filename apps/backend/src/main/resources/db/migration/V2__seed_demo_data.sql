-- password: Demo12345!
insert into users(email, password_hash, role_id, enabled)
select 'farmer@demo.com',
       '$2a$10$8V7vLG9fRCHTUQ7fY4fT4e7N0M4j3N4hd9xONjM3YsNEnf2kD6Z3m',
       r.id,
       true
from roles r
where r.name = 'ROLE_FARMER'
on conflict (email) do nothing;

insert into users(email, password_hash, role_id, enabled)
select 'buyer@demo.com',
       '$2a$10$8V7vLG9fRCHTUQ7fY4fT4e7N0M4j3N4hd9xONjM3YsNEnf2kD6Z3m',
       r.id,
       true
from roles r
where r.name = 'ROLE_BUYER'
on conflict (email) do nothing;

insert into farmer_profiles(user_id, full_name, farm_name, phone, town, region, bio, verified)
select u.id, 'Amadou Traore', 'Green Valley Farm', '+2237000000', 'Sikasso', 'Sikasso',
       'Organic vegetables and seasonal fruits.', true
from users u
where u.email = 'farmer@demo.com'
on conflict (user_id) do nothing;

insert into products(
  farmer_id, title, description, category, price, currency, quantity, unit, harvest_date,
  location, availability_status, is_published, moderation_status, tags
)
select fp.id, 'Fresh Tomatoes', 'Harvested this morning, pesticide-free.', 'Vegetables',
       2.50, 'USD', 120, 'KG', current_date, 'Sikasso', 'AVAILABLE', true, 'APPROVED', 'fresh,organic'
from farmer_profiles fp
join users u on u.id = fp.user_id
where u.email = 'farmer@demo.com';
