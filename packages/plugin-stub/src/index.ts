import type { Plugin } from '@w-ai/lib';

import pkg from '../package.json' with { type: 'json' };

const plugin: Plugin = {
  name: pkg.name,
  description: pkg.description,
  entities: {
    actions: {
      log: (arg: unknown) => {
        console.log(arg);
        return Promise.resolve(arg);
      },
    },
  },
};

export default plugin;
