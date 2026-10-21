create table if not exists clinic_ops (
  id          bigserial primary key,
  collection  text not null,
  item_id     text not null,
  payload     jsonb,
  created_at  timestamptz not null default now()
);
