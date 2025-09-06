#! /usr/bin/env node --env-file-if-exists=.env --experimental-strip-types --disable-warning=ExperimentalWarning

import type { Plugin } from '@w-ai/lib';
import type { ImmutablePlugins } from 'immutable-plugin-system';
import { ImmutableHost } from 'immutable-plugin-system';
import installedNodeModules from 'installed-node-modules';

function discoverPlugins(): string[] {
  const installed = installedNodeModules(true);
  const re = /^(@w-ai\/plugin-|w-ai-plugin-).*/;
  return installed.filter((m) => re.test(m));
}

async function loadPlugins(): Promise<ImmutablePlugins<Plugin>> {
  const names = discoverPlugins().sort();
  const result: Record<string, Plugin> = {};
  for (const name of names) {
    result[name] = (await import(name)).default;
  }
  return result;
}

export class Host extends ImmutableHost<Plugin> {
  constructor(plugins: ImmutablePlugins<Plugin>) {
    super(plugins);
  }
}

async function main(..._args: string[]): Promise<number> {
  const host = new Host(await loadPlugins());

  console.log('hello', Object.keys(host.plugins));

  host.entities.actions.get('log')[0]('boo');

  return 0;
}

main(...process.argv.slice(2))
  .catch((e: unknown) => {
    console.error('Unexpected error:', e);
    return 1;
  })
  .then((code: number) => {
    process.exitCode = code;
  })
  .finally(() => {
    process.stdin.destroy();
  });
