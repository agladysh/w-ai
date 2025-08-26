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

Therefore (using arktype-esque notation for schema):

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

self-linting of codestyle by is-good-action-definition etc.,
