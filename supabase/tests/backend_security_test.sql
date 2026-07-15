begin;
create extension if not exists pgtap with schema extensions;
select plan(36);

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
  not has_function_privilege('anon', 'public.claim_video_ingestion_jobs(integer,integer)', 'execute'),
  'anonymous clients cannot claim ingestion jobs'
);
select ok(
  has_function_privilege('service_role', 'public.claim_video_ingestion_jobs(integer,integer)', 'execute'),
  'the worker service can claim ingestion jobs'
);
select ok(
  not has_function_privilege('authenticated', 'public.complete_video_metadata_stage(bigint,uuid,text,text,jsonb,text,text,text,text,text,timestamptz)', 'execute'),
  'authenticated clients cannot complete metadata jobs'
);
select ok(
  has_function_privilege('service_role', 'public.complete_video_metadata_stage(bigint,uuid,text,text,jsonb,text,text,text,text,text,timestamptz)', 'execute'),
  'the worker service can complete metadata jobs'
);
select ok(
  not has_function_privilege('authenticated', 'public.fail_video_ingestion_job(bigint,uuid,text,text,boolean,integer)', 'execute'),
  'authenticated clients cannot transition ingestion failures'
);
select ok(
  has_function_privilege('service_role', 'public.fail_video_ingestion_job(bigint,uuid,text,text,boolean,integer)', 'execute'),
  'the worker service can transition ingestion failures'
);
select ok(
  not has_function_privilege('anon', 'public.get_video_processing_status(uuid)', 'execute'),
  'anonymous clients cannot bypass the safe status function'
);
select ok(
  has_function_privilege('service_role', 'public.get_video_processing_status(uuid)', 'execute'),
  'the status Edge Function can read safe processing state'
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

create temporary table claimed_ingestion as
select * from public.claim_video_ingestion_jobs(5, 120)
where idempotency_key = 'instagram:C0DEX_TEST_01:contract-test-v1';

select is((select count(*)::integer from claimed_ingestion), 1, 'the queue worker claims the durable message once');
select ok(
  public.complete_video_metadata_stage(
    (select message_id from claimed_ingestion),
    (select video_id from claimed_ingestion),
    (select idempotency_key from claimed_ingestion),
    'instagram_oembed',
    '{"title":"Contract test","author_name":"CTME"}'::jsonb,
    'Contract test',
    'CTME',
    null,
    'link_only',
    repeat('a', 64),
    now() + interval '1 day'
  ),
  'official metadata completion succeeds atomically'
);
select is(
  (select publication_state::text from public.videos where external_video_id = 'C0DEX_TEST_01'),
  'processing',
  'metadata completion does not publish before place resolution'
);
select is(
  (select status from ctme_private.ingestion_jobs where pipeline_version = 'contract-test-v1'),
  'metadata_ready',
  'the durable job records the metadata-ready stage'
);
select is(
  (select count(*)::integer from pgmq.q_video_ingestion where message->>'idempotency_key' = 'instagram:C0DEX_TEST_01:contract-test-v1'),
  0,
  'successful metadata work leaves no active queue message'
);
select is(
  (select count(*)::integer from pgmq.a_video_ingestion where message->>'idempotency_key' = 'instagram:C0DEX_TEST_01:contract-test-v1'),
  1,
  'successful metadata work archives its queue message for audit'
);
select is(
  (select count(*)::integer from ctme_private.provider_payloads where provider = 'instagram_oembed'),
  1,
  'the official provider response is retained only in the private schema'
);

select * from finish();
rollback;
