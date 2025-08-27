# PD001: Form-based AI

- Status: **IDEATION**

Inspiration:

- DSPy (somewhat)
- [OR-Q](https://github.com/agladysh/or-q)
- Unpublished prior work

## Concept

- Each LLM inference answers a query by filling a form via structured output.

- Think of forms as in (lightweight) paperwork, not as in HTML

- LLM is not allowed use of tools (except, in later stages, purely metacognitive ones, when deemed necessary for the
  form input), all interaction with the real world is done via forms (e.g. there is a form to update the file).

- There are input and output fields in the form. Input is the query, output is response or (generally) responses.

- Order of fields is important.

- Some output fields may be intermediate:
  - used to induce model order of thought,
  - used as a prompting tool to prime model behavior,
  - and/or used to workaround model quirks (like e.g. drive to leave a remark at all costs in some models).

- There may be several input fields as well, providing supplementary information to the model besides the query.

- Model personality, and, in general, the system message --- is a part of the form.

- Output field or fields of one form becomes input of another form or forms, possibly after transformation, thus forming
  AI flow graph.

- Forms are flexibly rendered, inintial implementation would likely have bureucratic fleur (i.e. as pseudo-documents,
  task tracker issues, emails, etc.).

- OR-Q provides DSL-like representation and framework for working with forms and fields as higher-order objects.

- Form shapes, filled out form documents, and business processes (form flows) are stored, cached, evaluated, dynamically
  generated and optimized etc.

- Since a form is a first-class citizen, it (both shape and document), as well as its individual components, may be
  input and / or output to other forms.

- Projects duly maintain libraries of form fields, shapes and processes and archives of form documents and evaluations.

- In AI-assisted software engineering, said artifacts are tracked in Git with the source code.

### Core Primitives

> [!NOTE] To be refined after additional studying of DSPy and other prior work.

- Field
  - Field Type
  - Name
  - Description
  - Validation
  - Transformation
  - Value
  - Cache Invalidation Rules

- Fieldset
  - Fields
  - Aggregate Fieldset Validation
  - Aggregate Fieldset Transformation
  - Cache Invalidation Rules

- Form
  - Name
  - Description
  - Input Fieldset
  - Output Fieldset
  - Aggregate Form Validation
  - Aggregate Form Transformation
  - Cache Invalidation Rules

- Validation
  - TBD

- Transformation
  - TBD

- Business Process
  - TBD

> [!NOTE] Prototype-based inheritance would be beneficial.

### Conceptual Studies

#### Study 1. Bottom-top: Demonstrate potential implementability for a simpler version

Ignores much of advanced aspects of the concept.

```yaml
commands:
  - alias:
    - -codebase
    - Loads files from `PROJECT_FILENAMES`, filtered by `-glob-`.
    - [ -glob- ]
    - - field-value: PROJECT_FILENAMES
      - filter: [ matches: -glob- ]
      - run: filenames-to-files

  - - _JSON:
      - INPUT:
          description: Generic input field
          value:
            - input
      - PROJECT_FILENAMES:
          description: Names of all LLM-accessible files in the project
          value:
            - run: codebase-filenames
            - form-value: INPUT
      - TS_CODE:
          description: Provide typescript code files
          value:
            # FIXME. Mixes up to-prompt and value, value should be JSON dictionary, to_prompt should be xml text
            - -codebase: 'src/**/*.ts'
            - form-value: INPUT
      - QUERY:
          description: Specify your query
          value:
            - form-value: INPUT
      - ROLE:
          description: Specify AI Assistant role here, a-la concise position profile
          value:
            - form-value: INPUT
          to-prompt:
            - f: |
              You were hired to the following position profile:
              <role>
              ${ field-value ROLE }
              </role>
      - ROLE-CTO-NODE-TS:
          description: LLM Role
          value:
            - t: |
              Best-of-field CTO, specializing in Node.js and TypeScript
            - field-value: ROLE
      - OUTPUT:
          description: Generic ouput field
          value:
            - input
      - SIMPLISTIC_CODE_REVIEW_REPORT:
          description: Provide your code review report here
          value:
            - field-value: OUTPUT
      - OPTIONAL_REMARKS:
          description: Provide your remarks here, if any
          optional: true
          value:
            - field-value: OUTPUT
  - define-form-fields

  - - _JSON:
      - SIMPLISTIC-CODE-REVIEW:
          description: Simplistic code-review query example
          input:
            - QUERY: form-input
            - TS_CODE
          output:
            - SIMPLISTIC_CODE_REVIEW_REPORT
            - OPTIONAL_REMARKS
  - define-forms
```

Verdict: Rawdogging is doable, but not pleasant.

While the study pseudocode is not fully fleshed out (e.g. there are almost no to-prompt keys, and no JSONSchema stuff
for structured output at all), there are larger problems.

This approach does not create first-class forms, but (at a stretch) can merely simulate them. We will be mired in
TeX-like problems very soon, if we're to implement more advanced parts of the concept without higher-order abstractions.

Main flaw though: the study does not demonstrate a business process. Next: top-bottom.

#### Study 2: Top-bottom: Business Process

Taxonomy:

1. Review
2. Code review
3. Code review of Node.js codebase
4. Code review of Node.js codebase in TypeScript
5. Code review of changes in Node.js codebase in TypeScript
6. Code review of refactoring in Node.js codebase in TypeScript
7. Code review of refactoring in Node.js codebase in TypeScript, in local dirty working copy of git.

We will study 7.

Query: `Please review my refactoring code changes before I commit them.`

Statically available assets:

1. Post-change working copy, all files
2. Diff (including untracked files)
3. Lint output
4. Full test run output
5. Dirtree of the project (see `dirtree` command)

Dynamically generated assets on the post-change working copy:

1. Annotated dirtree of the project (see `dirtree.md` for an example, but should be properly LODable)

With the help of some scripting (e.g. git workspaces, or lefthook-like staging sheghanigans), we may obtain pre-change
static and dynamic assets.

Additional tooling

1. Sourcegraph / CodeQL / whatever queries
2. AST-based code representations
3. Algorithmically-generated code documentation (e.g. JSDoc)
4. Codemods (not for code review, but workth mentioning)
5. Ideally, same for architectural level
6. Etc.

> [!IMPORTANT] As OR-Q operates on actions and inputs, business process operates on forms and business processeses
> (where filling out a form shape is a primitive business process, algorithmic inputs are filled out by micro-forms)

Therefore:

NB: Each entry will be in a separate yaml file. Slashes imply asset resolution.

```yaml
string: '@w-ai/plugin-primitives/actions/string.ts'
boolean: '@w-ai/plugin-primitives/actions/boolean.ts'

shell: '@w-ai/plugin-shell/actions/shell.ts' # Lazy. Prompt-heavy, should be yaml

then: tbd
else: tbd

ts: tbd

is-absolute-path:
  description: returns true if the path is absolute, false if it is not
  keywords: [ path, filesystem ]
  input: path
  output: boolean
  process:
    - ts: | # ts
      import { isAbsolute } from 'node:path';
      export default ($: {{input}}): {{output}} => isAbsolute($);

does-path-exist:
  description: returns true if the path exists, false if it is not
  keywords: [ path, filesystem ]
  input: path
  output: boolean
  process:
    - ts: | # ts
      import { existsSync } from 'node:fs';
      export default ($: {{input}}): {{output}} => existsSync($);

is-path-directory: TBD

contract/item/review: TBD
contract/item/review/pass: TBD
contract/item/review/fail: TBD

path-is-absolute:
  description: ensures path is absolute
  input: path
  output: contract/item/review
  process:
    - is-absolute-path: input
    - then:
       - contract/item/review/pass
    - else:
        - contract/item/review/fail: path is not absolute

path-does-exist:
  description: ensures path does exist
  input: path
  output: contract/item/review
  process:
    - does-path-exist: input
    - then:
        - contract/item/review/pass
    - else:
        - contract/item/review/fail: path does not exist on the filesystem

path:
  description: filesystem path
  keywords: [ path, filesystem ]
  input: string
  output: string
  process: null
  contract:
    - input
      - string-is-path

absolute-path:
  description: absolute filesystem path
  keywords: [ path, filesystem ]
  input: path
  output: path
  process: null
  contracts:
    - input:
      - path-is-absolute

existing-absolute-path:
  description: existing absolute filesystem path
  keywords: [ path, filesystem ]
  input: absolute-path
  output: absolute-path
  process: null
  contracts:
    - input:
      - path-does-exist

absolute-path-to-existing-directory:
  description: existing absolute filesystem path to a directory
  keywords: [ path, filesystem ]
  input: existing-absolute-path
  output: existing-absolute-path
  process: null
  contracts:
    input:
      - path-is-directory

absolute-path-to-existing-file: tbd

working-copy/root:
  description: absolute path to the root of the working copy
  keywords: [ working-copy, root, path ]
  input: null
  output: absolute-path-to-existing-directory
  process:
    - ts: | # ts
      import { readdirSync } from 'node:fs';
      export default (): {{output}} => readdirSync($, { recursive: true });

recursively-list-all-files:
  description: absolute paths to all files in a directory and its subdirectory, including dotfiles and ignored files
  input: artefact:absolute-path-to-existing-directory
  output: [ artefact:absolute-path-to-existing-file ]
  process:
    - ts: | # ts
      import { readdirSync } from 'node:fs';
      export default ($: {{input}}): {{output}} => readdirSync($, { recursive: true });

with-matching-file-paths: tbd
without-ignored-file-paths: tbd

working-copy/all-matching-files:
  description: list all files in the working copy, matching a minimatch pattern, respecting ignore rules
  keywords: [ tbd ]
  input: minimatch-pattern
  output: [ artefact:absolute-path-to-existing-file ] # Array of artefacts
  process:
    - recursively-list-all-files: [ working-copy/root ] # Subprocess, may have several entries
    - with-matching-file-paths: { input } # Reference, may be input.foo.bar.baz
    - without-ignored-file-paths: [ working-copy/workflow-ignore-rules ]

read-contents-of-all-file-paths: tbd

artefact:working-copy/contents-of-existing-files:
  # other fields tbd
  input: artefact:contents-of-existing-files
  output: artefact:contents-of-existing-files
  template: | # fishy!
      <files abspath={{ working-copy/root }}>
        {{ input }}
      </files>

working-copy/read-all-typescript-files:
  description: contents of all TS files in the working copy, respecting ignore rules
  keywords: [ working-copy, all-ts-files, typescript, code ]
  input: null
  output: artefact:working-copy/contents-of-existing-files
  process:
    - read-contents-of-all-file-paths: [ working-copy/all-matching-files: '**/*.ts' ] # Literal

# In prompt template:    - absolute-paths-to-relative: - working-copy/root

TODO: Review itself! Or better, let it bootstrap itself! (add action, exec?)
```

Interestingly, this seems MCP-esque. A good directory of these by various kinds of dependencies and keywords might help
LLM discovery greatly.

Also, we can generate code directly from these descriptions, and keep it.

And we may attribute the thing with any permission system we'd like, etc.

We need builtin blackbox tests, a-la our suites, with mock-fs a-la jsonfs.

Process, action, memo (not form), field, contract

NB: LLMs are unreliable. Thus, contracts.

Codemods from the get go.

Self-linting of codestyle by is-good-action-definition etc.,

(This concludes the study: we've got sidetracked, but got interestring results.)

### Study 3: Declarative Processes

Motivation:

- Design by Contract. However, we're not creating another programming language.

- Existing primitives (should the system be successful) will be dwarfed in number by applied processes and their local
  variations.

- We creating a system to express business processes for AI (hopefully) to be able to cope with.

- An LLM call is a black box, which implements an action in a business process as an ideal system (akin to IFR in TRIZ).

- One cannot guarantee the outcome of this action by manipulating its inputs. The only way to ensure successful outcope
  is by introducing feedback loops.

- Not all business process actions are executable by a single LLM call. There should be a robust way to de-idealize the
  action into several.

- There should be also a way to quickly compose together a workable solution for the problem at hand without spending
  too much effort on the nuances and contracts.

The design, presented here, claims to have a shot at the above.

See `.w-ai/assets` in the repository as the ground truth.

Initial notes:

1. Action is a Process (which is a series of actions).

2. Almost everything is Action or is composed of Actions (Action, Artefact, Contract, Predicate, Task, etc. --- are all
   the same).

3. Name resolution (to promote modularity):
   - Based on the node field (e.g. `input: foo` is `artefact/\*/foo`).
   - Order of lookup:
     - children (subdirectories), conflict if more than single match
     - siblings (same directory), after children (debatable), because modules might coexist
     - global, within same node field, conflict if more than single match
   - Conflicts are resolved by author including more of the path in the name: `bar/foo`.
   - A path may contain `/#/` cutoff mark in the middle to allow for action specialization:
     - If full path is not found, it is iteratively de-specialized by removing path elements up to the mark
     - So, for `quo/foo/#/bar/baz` the following paths are checked, in order:
       - `quo/foo/bar/baz`
       - `quo/foo/bar`
       - `quo/foo`
   - Special keyword-artefact `__infer__` may be used in `output:` to infer type Type of the last action in the process
     is used.
   - Notation:
     - Special characters:
       - `~` at the beginning of name denotes a string literal, all whitespace up to the first newline (including it)
         after `~` is consumed (usable only in process and contract keys)
       - `/` in the middle denotes path: `bar/foo` means artefact `foo`, residing in an immediate parent directory `bar`
       - `?` at the end denotes optionality: `foo?` means `foo` is optional (works for paths too: `bar/foo?`, usable
         only in artefacts key)
       - TBD: notation from `.w-ai/assets/action/ai/generate/providers/google/gemini-2_5-flash.yaml`
     - Node names may contain letters, numbers, underscores, dashes, and cannot begin with an underscore or dash
     - Any nodes names in double underscores are reserved keywords, e.g. `__infer__`
     - Placeholders (usable only in process and contract keys):
       - `{ foo }` (resolves to `{ foo: null }` in YAML) denotes a placeholder
       - `foo` is looked up in `input` field of the node, `foo.bar.baz` is also supported
     - NB: `test-contract` is a contract key too
     - NB: notation is valid in all keys, even where it is not usable

4. Action execution leaves observable trace in the form of memos (or Forms, we should ponder on naming). Fieldsets etc.
   are no longer a thing.
   - Observability, is, of course, a thing within the system itself as well, that's how e.g. recovering from failing
     contracts should work.

   - This is how the system would self-evolve: by analyzing its own performance.

   - Current thought is to write everything to files, under Git. We will deal with inevitable bloat after the system
     proves itself.

5. The idea is to translate YAML definitions to idiomatic typesafe TypeScript, not "run" them directly.
   - Note we do not build TypeScript, so translation and running should be fast.

   - This way we hope to avoid type system complexity and a few other problems (in exchange for type narrowing issues,
     which are, hopefully, solvable), providing a hope for a truly minimal core of the system, leveraging existing
     TypeScript / Node.js infrastructure to bootstrap.

   - TypeScript approach will create some solvable difficulties with running the thing as a service, but we should see
     the project to survive long enough for them to raise first.

   - Mapping TypeScript type system diagnostics to author-friendly task definition diagnostics can also be challenging
     (though hopefully doable with proper tooling), but an AI author would cope, and, again, we should see if that
     system reaches broader adoption for humans first.

   - Type mapping from foo-bar-baz to something TypeScript understand might also be non-trivial, but we might get away
     with postulating case-insensitive equivalence of foo-bar-baz, foo_bar-Baz, and FooBarBaz, and normalize to dashes
     in YAML, and CamelCase in TypeScript.

   - Note that performance (hopefully) should not be key here, as LLM calls are relatively slow, and, anyway, getting a
     successful result created in observable and (hopefully) understandable manner is better than getting a result
     quickly.

6. We would like to have a plugin system, where node packages provide additional assets to the same hierarchical
   namespace, similar to OR-Q. (Namespace collisions are easily solvable by enforceable path conventions.)

On state persistence:

1. We need to be invariant to process restarts per implicit product requirements (long-runnning autonomous processes,
   etc.).

2. We would like to rely on this invariance for code generation as well: when a new contract (or other node) is needed,
   it is generated in yaml, linted, translated to ts, linted again, and then we exit normally (perhaps indicating in the
   persisted state that we need a restart, but see next). The worker process is then started again by the runner, and
   resumes.

3. Ideally, state form is universal for any node and worker state, no additional metadata is written.

4. We need to write memos anyway, ideally the memos themselves (in their main machine-readable form) are the state,
   observable and debuggable.

TBD: Document what is implied in `.w-ai/assets/action/string/trim.yaml`.

Some ideation on state fs structure:

```text
# we crash on overflow of sequence numbers
.w-ai/.active/runner-<runner-pid>/
  .metadata.yaml # Any runner metadata, including instance UUID to protect from PID rotation
  0001-<node-name>/ # This is the root action, now running
    .input.yaml # Action input, includes worker PID
    0001-<node-name>.yaml # Memo of a completed action
    0002-<node-name>.yaml/ # This is sub-action, it is currently running
      .input.yaml
    0003-<node-name>.yaml/ # Another currently running sub-action
      .input.yaml
      ... and so on
```

NB: Directories have the `.yaml` "extension" to lessen chances of corrupt state, where an action is both completed and
running at the same time.

Unless a dedicated debug flag is enabled, we persist only nodes in process, contract, and test-contract, as well as any
node at all that has its `meta.__runner__.persist` flag set to true.

This is a bit fs-heavy, but, OTOH, we may always set `meta.__runner___.persist` to false for any actions without
side-effects we find spammy.

On execution:

- Process feeds input of the last action to the next, contract feeds output of process to each action, otherwise they
  are the same.

- Ideally, both `process` and `contract` keys are implemented as sugars, which are translated to e.g. node's first-class
  `__run__` field on load, which handles pipelining on general principles.

- If a node has `__run__` field set explicitly, it is executed before anything else (that is, `process` and `contract`
  push to it, not override).

- `contract` also injects last step in `__run__`, which captures contract steps data as entry in the memo, returns
  `true` if all contract entries are `true`, which becomes `__run__.__result__`.

- `__run__.__result__` is set to a first class reject object on any errors.

- `process` in fact does similar, only simpler and without branching: it injects last step, which merely captures
  `process.__previous__` into a memo entry.

- Ideally, these last steps are proper first-class actions, defined in YAML, and configurable per node, if desired.

- Parent node's `process` continues if child's `__run__.__result__` is `true`, and stops otherwise.

- Artefacts execute their processes (normally empty) and contracts (if any) on construction, on general principles (that
  is, pipeline is to be designed in such manner that they are naturally executed).

- Which means that artefacts and predicates are also first-class executable actions, accessible e.g. in process by e.g.
  `/artefacts/**/string`.

We would need parallel action execution as well. Process-like fields should support nested arrays, with attribution.

```yaml
process:
  - __parallel__ as results:
      - fetch as foo: https://example.org/1
      - fetch as bar: https://example.org/2
      - fetch as baz: https://example.org/3
  - . json/stringify: { process.results }
contract:
  - is-string
```

Which translates to (rough AST/s-expression-esque sketch):

```yaml
# Note metadata like source mapping will be included as a third argument of the tuple
# E.g.: `[ ref, [ __run__, process ] ]` is actually `[ ref, [ __run__, process ], [ __file__, 10, 20 ] ]`,
# where 10 is the line number, and 20 is the column number.
# On any failures, __run__.__result__ is set to a first-class reject object, and running bails out
__run__: [
    seqential,
    [
      [set, [[literal, [[__run__, process]]], {}]],
      [set, [[literal, [[__run__, process, __previous__]]], [ref, [literal, [input]]]]],
      [
        set,
        [
          [literal, [[__run__, process, __previous__], [__run__, process, results]]],
          [
            parallel, # Pushes scope. Inherits existing variables by copy-on-write, local changes do not propagate up
            [
              [
                set,
                [
                  [literal, [[__run__, process, __previous__], [__run__, process, foo]]],
                  [
                    call,
                    [
                      # We may opt pre-resolve unambigous static references at the translation step as an optimization,
                      # but a trivial runtime cache in resolve will go a long way to offsetting the performance hit.
                      # We may also opt to have specialized resolve commands, e.g. resolve-globstar, etc. in the future.
                      # __dirpath__ contains pre-parsed path of the current node's dirname.
                      [resolve, [literal, [__dirpath__, action, fetch]]],
                      https://example.org/1,
                    ],
                  ],
                ],
              ],
              [
                set,
                [
                  [literal, [[__run__, process, __previous__], [__run__, process, bar]]],
                  [call, [[resolve, [literal, [__dirpath__, action, fetch]]], https://example.org/2]],
                ],
              ],
              [
                set,
                [
                  [literal, [[__run__, process, __previous__], [__run__, process, baz]]],
                  [call, [[resolve, [literal, [__dirpath__, action, fetch]]], https://example.org/3]],
                ],
              ],
            ],
          ],
        ],
      ],
      [
        set,
        [
          [literal, [[__run__, process, __previous__]]],
          [
            call,
            [
              [resolve, [literal, [__dirpath__, action, json/stringify]]],
              [ref, [literal, [__run__, process, results]]],
            ],
          ],
        ],
      ],
      [
        set,
        [
          [literal, [[output]]],
          [
            new, # TODO: Fishy, hidden compexity.
            [
              [ref, [literal, [__output_type__]]], # calls `act` and `bail` internally as necessary
              [ref, [literal, [__run__, process, __previous__]]],
            ],
          ],
        ],
      ],
      [set, [[literal, [[__run__, contract]]], { status: running, clauses: [] }]],
      [
        push,
        [
          [literal, [__run__, contract, clauses]],
          [
            set, # set returns the value for convenience
            [
              [literal, [[__run__, contract, __previous__]]],
              [
                call,
                [[resolve, [literal, [__dirpath__, predicate, is-string]]], [ref, [literal, [__run__, contract]]]],
              ],
            ],
          ],
        ],
      ],
      [set, [[literal, [[__run__, contract, status]]], [every, [ref, [literal, [__run__, contract, clauses]]]]]],
      [unless, [[ref, [literal, [__run__, contract, status]]], [bail, [[ref, [literal, [__run__, contract]]]]]]],
    ],
  ]
```

The above may be viewed as IR of the node program, made to be trivial to generate TypeScript from. Any non-trivialities
in generation are generally to be resolved towards adapting the IR form, balancing with the ease of the IR generation
itself.

Ideally (in spirit), the whole thing bootstraps from a hand-written bootstrapping node, which has only `name`,
`description`, and `__run__` fields. All other fields and logic are handled by `__run__` as conventions.

Interestingly, that does not imply `defun`, as we already have actions. E.g., ideally, persistence and even
runner/worker logic are actually nodes.

All verbs in the AST are actuall first-class action nodes, written in IR, working on array inputs, and usable from
normal code. To preserve readability of the generated code, the IR has the following convention on verb name resolution:
Normalized verb is `[ module, file, verb ]` tuple. String verb `foo` is normalized to
`[ @w-ai/plugin-ir, @w-ai/plugin-ir/generated/ir/foo.ts, foo ]`. Verbs are transparently disambiguated on load
post-processing, so `verb` to `[ module, file ]` pair is unique across the file.

NB: `module` is used to manage `package.json` list of dependencies. It is false for local ad-hoc code that does not
create a dependency.

Exception: `literal` verb is translated to `literal`.

AST conventions:

Normalized AST node shape is `[ [ module, file, verb ] | "literal", param, [ file, line, column ] ]`.

If `"literal"`, node is substituted with `param`.

If `param` is not an array, it is used directly as an argument to verb.

If `param` is array, it is treated as nested program (list of AST nodes).

Illustration (sketch):

```yaml
[set, [[literal, [[__run__, contract, status]]], [some, [ref, [literal, [__run__, contract, clauses]]]]]]
```

is naïvely translated to:

```ts
import { RuntimeNode } from '@w-ai/lib/node/runtime.ts';
import { set } from '@w-ai/plugin-ir/generated/ir/set.ts';
import { some } from '@w-ai/plugin-ir/generated/ir/some.ts';
import { ref } from '@w-ai/plugin-ir/generated/ir/ref.ts';

export default async <T extends RuntimeNode>(node: T) => {
  return set(node, [['__run__', 'contract', 'status']], some(node, ref(node, ['__run__', 'contract', 'clauses'])));
};
```

...which is fine for normal nodes, but for the IR nodes we might eventually strive to translate to something like this
instead:

```ts
import { RuntimeNode } from '@w-ai/lib/node/runtime.ts';

export default async <T extends Node>(RuntimeNode: T): Promise<T> => {
  node.__run__.contract.status = node.__run__.contract.clauses.some((v) => v); // Async omitted
  return node;
};
```

Verbs:

- `set`: `[ objpath[], value ]` -> `value`, sets `node[...objpath[i]]` to `value` for each `objpath[]` and returns that
  value
- `literal`: `[ value ]` -> `value`, returns value, needed to work with array values
- `ref`: `[ objpath[] ]` -> `value`, looks up value in node by objpath
- `new`: tbd, hidden complexity.
- `call`: tbd
- `resolve`: tbd
- `sequential`: tbd
- `parallel`: tbd, calls node.clone() per item, which returns a CoW clone of the node.
- `bail`: tbd
- `unless`: tbd
- `push`: tbd
- `every`: tbd, checks that each array element is `true`

For ease of the initial implementation of the translator, `ref` should be wrapped in `get`, which accepts a string,
parses it, and calls `ref` internally.
