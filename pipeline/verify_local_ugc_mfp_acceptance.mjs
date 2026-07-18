import { rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const node = process.execPath;

const fullTestFiles = [
  'tests/placeExtraction.test.mjs',
  'tests/localPrototypeState.test.mjs',
  'tests/communityMapState.test.mjs',
  'tests/sharedLocationTask.test.mjs',
  'tests/videoIngestion.test.mjs',
  'tests/librarySearch.test.mjs',
  'tests/destinationQuality.test.mjs',
  'tests/localLensStudy.test.mjs',
  'tests/localLanguageResearch.test.mjs',
  'tests/localUseCuration.test.mjs',
  'tests/localKnowledgeSubmission.test.mjs',
  'tests/supabaseBackendContract.test.mjs',
];

const steps = [
  {
    name: 'unit and contract tests',
    command: [node, '--test', ...fullTestFiles],
  },
  {
    name: 'video snapshot materialization boundary',
    command: [node, 'pipeline/materialize_video_snapshots.mjs'],
  },
  {
    name: 'generated image manifest verification',
    command: [node, 'pipeline/verify_generated_images.mjs'],
  },
  {
    name: 'Astro production build',
    command: [node, './node_modules/.bin/astro', 'build'],
  },
  {
    name: 'rendered local UGC MFP browser flow',
    command: [node, 'pipeline/verify_local_ugc_mfp_rendered.mjs'],
  },
];

function runStep(step) {
  console.log(`\n[local-ugc-mfp] ${step.name}`);
  const [command, ...args] = step.command;
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${step.name} failed with exit code ${result.status}`);
  }
}

await rm('dist', { recursive: true, force: true });
await rm('.astro', { recursive: true, force: true });

for (const step of steps) {
  runStep(step);
}

console.log('\n' + JSON.stringify({
  ok: true,
  gate: 'local-ugc-mfp',
  checks: [
    'unit-contracts',
    'build-prerequisites',
    'clean-static-build',
    'rendered-discover-status',
    'rendered-reviewed-ugc-save-profile',
    'rendered-ugc-packet-profile',
    'rendered-reviewed-grid-save-profile',
  ],
}));
