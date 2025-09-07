import type { ImmutableEntities, ImmutablePlugin } from 'immutable-plugin-system';

export interface Value {
  type: string,
  value: unknown;
}

export interface Action {
  readonly inputType: string;
  readonly outputType: string;
  run: (arg: Value) => Promise<Value>;
}

export interface Type {
  check: (arg: Value) => true | string
}

export type Entities = {
  actions: ImmutableEntities<string, Action>;
  types?: ImmutableEntities<string, Type>;
};

export interface Plugin extends ImmutablePlugin<Entities> {
  description: string;
}
