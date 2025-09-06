import type { ImmutableEntities, ImmutablePlugin } from 'immutable-plugin-system';

type Action = (arg: unknown) => Promise<unknown>;

type Entities = {
  actions: ImmutableEntities<string, Action>;
};

export interface Plugin extends ImmutablePlugin<Entities> {
  description: string;
}
