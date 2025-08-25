#! /usr/bin/env node --env-file-if-exists=.env --experimental-strip-types --disable-warning=ExperimentalWarning

async function main() {
  console.log('w-ai');
}

main()
  .catch((e: unknown) => {
    console.error('Unexpected error:', e);
    process.exitCode = 1;
  })
  .finally(() => {
    process.stdin.destroy();
  });
