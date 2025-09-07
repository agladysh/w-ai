import type { Plugin, Value } from '@w-ai/lib';

import pkg from '../package.json' with { type: 'json' };

const plugin: Plugin = {
  name: pkg.name,
  description: pkg.description,
  entities: {
    actions: {
      log: {
        inputType: 'unknown',
        outputType: 'unknown',
        run: (arg: Value) => {
          console.log(arg);
          return Promise.resolve(arg);
        },
      }
    },
  },
};

export default plugin;
