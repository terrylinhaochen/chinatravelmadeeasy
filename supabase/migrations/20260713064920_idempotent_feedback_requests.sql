alter table public.place_experiences
  add column client_request_id uuid;

alter table public.place_experiences
  add constraint place_experiences_user_request_unique
  unique (user_id, client_request_id);

alter table public.place_corrections
  add column client_request_id uuid;

alter table public.place_corrections
  add constraint place_corrections_user_request_unique
  unique (user_id, client_request_id);

comment on column public.place_experiences.client_request_id is
  'Browser-generated idempotency key retained across magic-link callbacks and network retries.';

comment on column public.place_corrections.client_request_id is
  'Browser-generated idempotency key retained across magic-link callbacks and network retries.';
