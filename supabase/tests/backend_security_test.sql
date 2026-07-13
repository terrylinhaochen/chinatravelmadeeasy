begin;
create extension if not exists pgtap with schema extensions;
select plan(21);

select ok(
  (select bool_and(c.relrowsecurity)
   from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r'),
  'every public table has RLS enabled'
);
select ok(
  (select bool_and(c.relrowsecurity)
   from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'ctme_private' and c.relkind = 'r'),
  'every private operational table has defense-in-depth RLS'
);
select ok(
  not has_function_privilege('anon', 'public.consume_submission_rate_limit(text,timestamptz,timestamptz)', 'execute'),
  'anonymous clients cannot consume rate-limit counters'
);
select ok(
  has_function_privilege('service_role', 'public.consume_submission_rate_limit(text,timestamptz,timestamptz)', 'execute'),
  'service functions can consume rate-limit counters'
);
select ok(
  not has_function_privilege('authenticated', 'public.register_video_submission(public.video_platform,text,text,text)', 'execute'),
  'authenticated clients cannot register ingestion jobs directly'
);
select ok(
  has_function_privilege('service_role', 'public.register_video_submission(public.video_platform,text,text,text)', 'execute'),
  'service functions can atomically register ingestion jobs'
);
select ok(
  not has_function_privilege('authenticated', 'public.save_place_experience(uuid,uuid,uuid,public.experience_verdict,text,date,text,text[])', 'execute'),
  'authenticated clients cannot spoof the user id on feedback RPCs'
);
select ok(
  has_function_privilege('service_role', 'public.save_place_experience(uuid,uuid,uuid,public.experience_verdict,text,date,text,text[])', 'execute'),
  'service functions can save verified feedback'
);
select ok(
  not has_column_privilege('anon', 'public.place_experiences', 'user_id', 'select'),
  'anonymous readers cannot select feedback owner ids'
);
select ok(
  not has_column_privilege('anon', 'public.place_experiences', 'client_request_id', 'select'),
  'anonymous readers cannot select feedback idempotency keys'
);
select ok(
  has_column_privilege('anon', 'public.place_experiences', 'verdict', 'select'),
  'anonymous readers can select useful published verdicts'
);
select ok(
  not has_table_privilege('authenticated', 'public.place_experiences', 'insert'),
  'authenticated clients cannot bypass feedback validation with direct inserts'
);
select ok(
  not has_table_privilege('authenticated', 'public.place_corrections', 'insert'),
  'authenticated clients cannot bypass correction validation with direct inserts'
);
select is(
  (select reloptions::text from pg_class where oid = 'public.published_place_experiences'::regclass),
  '{security_invoker=true}',
  'the public feedback view applies caller RLS'
);

select is(
  (select allowed from public.consume_submission_rate_limit(repeat('a', 64), date_trunc('hour', now()), date_trunc('day', now()))),
  true,
  'first submission in a rate bucket is allowed'
);
do $$
begin
  perform * from public.consume_submission_rate_limit(repeat('a', 64), date_trunc('hour', now()), date_trunc('day', now()));
  perform * from public.consume_submission_rate_limit(repeat('a', 64), date_trunc('hour', now()), date_trunc('day', now()));
end
$$;
select is(
  (select allowed from public.consume_submission_rate_limit(repeat('a', 64), date_trunc('hour', now()), date_trunc('day', now()))),
  false,
  'fourth submission in an hour is rejected atomically'
);

create temporary table first_submission as
select * from public.register_video_submission(
  'instagram', 'C0DEX_TEST_01', 'https://www.instagram.com/reel/C0DEX_TEST_01/', 'contract-test-v1'
);
create temporary table second_submission as
select * from public.register_video_submission(
  'instagram', 'C0DEX_TEST_01', 'https://www.instagram.com/reel/C0DEX_TEST_01/', 'contract-test-v1'
);

select is((select cached from first_submission), false, 'first canonical video registration is new');
select is((select cached from second_submission), true, 'duplicate canonical video registration is cached');
select is(
  (select submit_count from public.videos where external_video_id = 'C0DEX_TEST_01'),
  2,
  'duplicate registrations increment submit count once'
);
select is(
  (select count(*)::integer from ctme_private.ingestion_jobs where pipeline_version = 'contract-test-v1'),
  1,
  'duplicate registrations create one durable ingestion job'
);
select is(
  (select count(*)::integer from pgmq.q_video_ingestion where message->>'idempotency_key' = 'instagram:C0DEX_TEST_01:contract-test-v1'),
  1,
  'duplicate registrations enqueue one durable message'
);

select * from finish();
rollback;
