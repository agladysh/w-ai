# I01-S4: Bootstrapping Contract-Driven Declarative AI-Enabled Processes

- **Status:** Ideation
- **See also:**
  - [I01: Studies in Contract-Driven Declarative AI-Enabled Processes](./I01-contract-ai-studies.md)

## Introduction

Study 3 of the I01 has high complexity. We need a simpler system to get started.

The main requirement for the S4 system is for it to be able to develop itself following human instructions.

To do so it must be able to:

- Actions:
  - Query LLM in chat-instruct mode (system message + user message -> agent message).
  - Format system and user messages, set structured output for agent message.
  - Run shell commands, piping stdin in, and capture stdout, stderr, exit code.
  - Format shell command parameters.

- Composition:
  - Predicate and regular actions form processes.
  - Contracts are formed of predicate actions.
  - Actions are either named built-ins or named compositions of other actions as processes and contracts.

- All actions are, of course, asynchronous.

Not initially required:

- Action name resolution
- Process persistence
- Type-safety
- On-the-fly code rebuilding
- Syntax sugars

Stack:

- TS, node
- spawn for shell
- fetch for LLM access
- Gemini 2.5 flash, t=0 for LLM

## Study I01-S4-A

- We choose to have strict typing to avoid debugging murky errors.
- Trying out `tempura` for templates.

### Action YAML Node Record

- `name`: fully-qualified unique action identifier
- `description`: human-readable description
- `input`: input arktype-esque schema
- `output`: output arktype-esque schema
- `do`: sub-actions or typescript template for built-in implementation
- `tests`: black-box tests

TypeScript template fields:

- context set to the node object
- meta.\_\_ts fields:
  - meta.\_\_ts.input: input definition filename
  - meta.\_\_ts.output: output definiton filename
  - meta.\_\_ts.run: run implementation filename

### Implementation

#### `action/shell/spawn/foreground.yaml`

```yaml
name: action/shell/spawn/foreground
description: spawns foreground shell

input:
  command: artefact/string/non-empty
  args?: artefact/string/non-empty[]

output:
  stdout: artefact/string
  stderr: artefact/string
  code: artefact/integer >= 0

run: | # ts
  import { Input } from '{{meta.__ts.input}}';
  import { Output } from '{{meta.__ts.output}}';
  import { spawn } from 'core/actions/shell/spawn.ts';

  export async function run(input: Input): Promise<Output> {
    return spawn(input);
  }

tests:
  - name: smoke
    argv: i01s4 run "action/shell/spawn/foreground"
    stdin: | # yaml
      --- !<tag:github.com/agladysh/w-ai/i01s4,2025:artefact/shell/spawn/request>
      command: echo
      args:
        - test
    stdout: | # yaml
      --- !<tag:github.com/agladysh/w-ai/i01s4,2025:artefact/shell/spawn/response>
      stdout: |
        test
      stderr: ''
      code: 0
```
