#! /usr/bin/env node --env-file-if-exists=.env --experimental-strip-types --disable-warning=ExperimentalWarning

import type { Plugin } from '@w-ai/lib';
import type { ImmutablePlugins } from 'immutable-plugin-system';
import { ImmutableHost } from 'immutable-plugin-system';
import installedNodeModules from 'installed-node-modules';
import { ArkErrors, scope } from 'arktype';

/*
abstract class Action<ID extends string, Input extends Type, Output extends Type> {
  readonly id: ID;
  readonly input: Input;
  readonly output: Output;

  constructor(id: ID, input: Input, output: Output) {
    this.id = id;
    this.input = input;
    this.output = output;
  }

  async run(input: unknown): Promise<typeof this.output.infer> {
    input = this.input(input);
    if (input instanceof ArkErrors) {
      throw new TypeError(`${this.id}: invalid input: ${input.summary}`);
    }
    return this.execute(input);
  }

  protected abstract execute(input: typeof this.input.infer): Promise<typeof this.output.infer>;
}

function action<
  ID extends string,
  Input,
  Output,
>(id: ID, loader: (input: unknown) => Input | ArkErrors, handler: (input: Input) => Promise<Output>) {
  return async function run(input: unknown): Promise<Output> {
    const validatedInput = loader(input);
    if (validatedInput instanceof ArkErrors) {
      throw new TypeError(`${id}: invalid input: ${validatedInput.summary}`);
    }
    return handler(validatedInput);
  }
}

const $ = scope({
  'input': 'string#wai.string',
  'output': 'string#wai.string',
});

const types = $.export();

const print = action('print', types.input, async (input: typeof types.input.infer): Promise<typeof types.output.infer> => {
  console.log(input);
  return input;
});
*/

function typeError(message: string): never {
  throw new TypeError(message);
}

/*
interface Node<Input = unknown, Output = unknown> {
  run: (input: Input) => Promise<Output>;
}

type PredicateNode<Input = unknown> = Node<Input, boolean>;

type ArtefactNode<Output = unknown> = Node<unknown, Output>;

const predicateRegistry: Record<string, PredicateNode> = { };

predicateRegistry['is-string'] = { async run(input: unknown) { return typeof input === 'string' } };

// XXX: Remove this stub. Horrible error reporting too.
function artefact<Output = unknown>(name: string, predicateIds: string[]) {
  const predicates = predicateIds.map(id => predicateRegistry[id] ?? typeError(`${name}: unknown predicate ${id}`));
  return {
    run: async (input: unknown): Promise<Output> => {
      for (const p of predicates) {
        if (!await p.run(input)) {
          return typeError(`input is not ${name}`);
        }
      }
      return input as Output;
    }
  } as PredicateNode<Output>;
}

const artefactRegistry: Record<string, ArtefactNode> = { };

artefactRegistry['string'] = artefact('string', [ 'is-string' ]);

const actionRegistry: Record<string, Node> = { };

function action<Input = unknown, Output = unknown>(name: string, input: string, node: Node<Input, Output>) {
  const artefact = artefactRegistry[input] ?? typeError(`${name}: unknown artefact ${input}`);
  return {
    run: async(rawInput: unknown): Promise<Output> => {
      const input = await artefact.run(rawInput) as Input;
      return node.run(input);
    }
  }
}

actionRegistry['print'] = action('print', 'string', {
  run: async(input: unknown): Promise<string> => {
    console.log('print', input);
    return input as string;
  }
});

*/

/*
interface Value<T = unknown, Type extends string = string> {
  readonly value: T;
  readonly type: Type;
}

function value<T, Type extends string>(value: T, type: Type): Value<T, Type> {
  return {
    value,
    type,
  };
}

interface Node<Input extends Value = Value, Output extends Value = Value> {
  input: Input['type'];
  output: Output['type'];
  run: (input: Input) => Promise<Output>;
}

const registry: Record<string, Node> = {};

registry['predicate/is-string'] = {
  input: 'unknown',
  output: 'boolean',
  run: async (input: Value): Promise<Value<boolean, 'boolean'>> => {
    return value(typeof input.value === 'string', 'boolean');
  },
};

registry['artefact/string'] = {
  input: 'unknown',
  output: 'artefact/string',
  run: async(input: Value): Promise<Value> => {
    const isString = registry['predicate/is-string'] ?? typeError('internal error');
    if (!(await isString.run(input)).value) {
      console.error(input);
      return typeError('contract failure');
    }
    return value(input.value as string, 'artefact/string');
  }
}

registry['action/print'] = {
  input: 'artefact/string',
  output: 'artefact/string',
  run: async(input: Value): Promise<Value> => {
    const string = registry['artefact/string'] ?? typeError('internal error');
    input = await string.run(input);
    if (input.type !== 'artefact/string') {
      return typeError(`bad input`);
    }
    console.log('print', input.value);
    return input;
  }
}

const program = [
  [ 'action/print', 'foo' ]
];
*/

const $ = scope({
  'nodeName': 'string > 0',

  'step': {
    'run': 'nodeName',
  },

  'schema': 'string | object',

  'node': {
    'name': 'nodeName',
    'description': 'string > 0',
    'input': 'schema',
    'output': 'schema',
    'process': 'step[]',
    'contract': 'step[]',
  }
});

const types = $.export();

type NodeData = typeof types.node.infer;

interface Value<Type extends string = string, T = unknown> {
  type: Type;
  value: T;
}

class Context {

}

/*
function loadInput(node: NodeData): unknown[] {
  return [
    { run: 'dbg', with: [ 'section', 'input' ] },
    { run: 'get', with: 'input' },
    { run: 'narrow', with: node.input },
  ];
}

function runProcess(node: NodeData): unknown[] {
  const result: unknown[] = [
    { run: 'dbg', with: [ 'section', 'process' ] },
    { run: 'set', with: [ 'process', 'previous' ]},
  ];

  for (let i = 0; i < node.process.length; ++i) {
    const step = node.process[i];
    result.push(
      { run: 'dbg', with: [ 'step', i ] }, // TODO: Not dbg? this is a persistence hook!?
      { run: step.run, with: [ ] }, // TODO: step.with or whatever
      // TODO: step.as or whatever
      { run: 'set', with: [ 'process', 'step', i ]},
      { run: 'set', with: [ 'process', 'previous' ]},
    );
  }

  return result;
}
const loadNode = types.node.pipe(n => {
  return {
    name: n.name,
    description: n.description,
    run: [
      { run: 'dbg', with: [ 'node', n.name ] },
      ...loadInput(n),
      ...runProcess(n),
      ...checkOutput(n),
      ...checkContract(n),
    ],
  };
});
*/

const taskInput = Symbol('w-ai:task:input');

function checkInput(n: NodeData) {
  return {
    task_id: `node:check:input:${n.name}`,
    plan: [
      {
        do: 'narrow',
        param: {
          actual: '$.input_value',
          expected: '$.input',
        },
      },
    ],
  };
}

function runProcess(n: NodeData) {
  const plan = n.process.flatMap((p, i) => [
    {
      verb: 'call',
      param: {
        do: p.do,
        with: p.with,
      },
    },
    {
      verb: 'store',
      param: {
        to: `$.process_steps[${p.as ? JSON.stringify(p.as) : i}]`,
      },
    },
  ]);

  plan.push({
    verb: 'store',
    param: {
      to: '$.output_value',
    }
  });

  return {
    task_id: `node:run:process:${n.name}`,
    plan: plan,
  }
}

function checkOutput(n: NodeData) {
  return {
    task_id: `node:check:output:${n.name}`,
    plan: [
      {
        do: 'narrow',
        param: {
          actual: '$.output_value',
          expected: '$.output',
        },
      },
    ],
  };
}

function runContract(n: NodeData) {
  const plan = n.contract.flatMap((c, i) => [
    {
      verb: 'call',
      param: {
        do: c.do,
        with: c.with,
      },
    },
    {
      verb: 'store',
      param: {
        to: `$.contract_value[${c.as ? JSON.stringify(c.as) : i}]`,
      },
    },
  ]);

  return {
    task_id: `node:run:contract:${n.name}`,
    data: { ...n, contract_value: {} },
    plan: plan,
  }
}

function checkContract(n: NodeData) {
  return {
    task_id: `node:check:contract:${n.name}`,
    plan: [
      {
        do: 'narrow',
        param: {
          actual: '$.contract_value',
          expected: 'contract/pass',
        },
      },
    ],
  };
}

const loadNode = types.node.pipe(n => {
  return {
    task_id: `node:${n.name}`,
    scope: { ...n, input_value: taskInput, output_value: undefined, contract_value: {}, process_steps: {} },
    output: '$.output_value',
    plan: [
      checkInput(n),
      runProcess(n),
      checkOutput(n),
      runContract(n),
      checkContract(n),
    ]
  }
});

/* Verbs:
 *  - narrow { actual, expected }
 *  - call { do, with}
 *  - store { to }
 */

// XXX: Nope, seems this should be pipelined as .get() calls after all, it seems. Need fancy boxed types.

/*
class Print implements Node<'print', string, string> {
  readonly name: 'print' = 'print';
  private input: string;
  constructor(input: string) {
    this.input = input;
  }
  checkInput(input: unknown): input is string {
    return typeof input === 'string';
  }
  async get(): Promise<string> {
    console.log(this.name, this.input);
    return this.input;
  }
}
*/

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
  for (const row of program) {
    const [ verb, param ] = row;
    const node = registry[verb] ?? typeError('unknown action');
    await node.run(value(param, 'unknown'));
  }

  const host = new Host(await loadPlugins());

  console.log('hello', Object.keys(host.plugins));

  await host.entities.actions.get('log')[0].run({ type: 'string', value: 'boo' });

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
