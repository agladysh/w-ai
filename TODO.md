# TODO

Keep sections in decreasing order of priority.

## First Priority

- [x] Remove `input:` contracts: input contracts are always guaranteed, we validate only outputs and side-effects
- [x] Document YAML placeholder conventions
- [ ] Switch to YAML tags, introducing a concise YAML form, translating to JSON-equivalent verbose YAML form (where
      action/string/reference are clearly tagged objects), and document that
  - `!input`, and other node fields
  - `!builtin` (and replace `:` with `/` in paths, so imports just work without string transformation)
  - `!do`
  - `!infer`
  - `!ref foo.bar.baz`
- [ ] Implement `generate-gemini-md` dependencies
- [ ] Implement `contract/`
- [ ] Implement `@w-ai/cli/builtin/artefact/core/node/input.ts`
- [ ] Implement `@w-ai/cli/builtin/predicate/core/is-node.ts`
- [ ] Implement `@w-ai/cli/builtin/action/ts.ts`
- [ ] Check `assets/` self-consistency
- [ ] Implement code generation
- [ ] Add optional `core/node` `keywords` input field
- [ ] Implement JSONSchema generation, plug it in VSCode

## Low Hanging Fruits

- _(No standing items)_

## Testing

- _(No standing items)_

## Development Documentation

- _(No standing items)_

## User Documentation

- _(No standing items)_

## Plugins

- _(No standing items)_

## Core

- _(No standing items)_

## Architectural Debt

- _(No standing items)_

## Design Debt

- _(No standing items)_

## Technical Debt

- _(No standing items)_

## Product

- _(No standing items)_

## Dependency Management

- _(No standing items)_

## Backlog

- _(No standing items)_

## Unsorted

Priority of items in this section is unknown. Triage them to other directories.

- _(No standing items)_
