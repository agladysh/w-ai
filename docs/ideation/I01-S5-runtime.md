# I01-S5: Runtime

Mandatory node fields:

- `name`: node id
- `description`: node description
- `input`: node input schema
- `output`: node output schema
- `process`: node actions to convert input to output, side-effects allowed
- `contract`: contract on node execution

Types:

- Action: node or builtin
- Predicate: node with boolean output
- Artefact: schema node

Observe that we're doing higher-order programming with nodes.

So it is not node.run, it is node.get?

```ts
interface Node<Input, Output> {
  constructor(input: Input);
  get(): Promise<Output>; // May memoize, or not.
}
```
