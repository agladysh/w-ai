---
title: 'Setup'
source: https://arktype.io/docs/intro/setup
url: https://arktype.io/docs/intro/setup
---

[📈 Announcing ArkType 2.1 📈](https://arktype.io/docs/blog/2.1)

Intro

# Setup

## [Installation](https://arktype.io/docs/intro/setup#installation)

pnpmnpmyarnbun

```
pnpm install arktype
```

You'll also need...

- TypeScript version `>=5.1`.
- A `package.json` with `"type": "module"` (or an environment that supports ESM imports)
- A `tsconfig.json` with...
  - [`strict`](https://www.typescriptlang.org/tsconfig#strict) or
    [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) ( **required**)
  - [`skipLibCheck`](https://www.typescriptlang.org/tsconfig#skipLibCheck) (strongly recommended, see
    [FAQ](https://arktype.io/docs/faq#why-do-i-see-type-errors-in-an-arktype-package-in-node_modules))
  - [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes) (recommended)

## [VSCode](https://arktype.io/docs/intro/setup#vscode)

### [Settings](https://arktype.io/docs/intro/setup#settings)

To take advantage of all of ArkType's autocomplete capabilities, you'll need to add the following to your workspace
settings at `.vscode/settings.json`:

```
// allow autocomplete for ArkType expressions like "string | num"
"editor.quickSuggestions": {
 "strings": "on"
},
// prioritize ArkType's "type" for autoimports
"typescript.preferences.autoImportSpecifierExcludeRegexes": [\
 "^(node:)?os$"\
],
```

### [Extension (optional)](https://arktype.io/docs/intro/setup#extension-optional)

[ArkDark](https://marketplace.visualstudio.com/items?itemName=arktypeio.arkdark) provides the embedded syntax
highlighting you'll see throughout the docs.

Without it, your definitions can still feel like a natural extension of the language.

With it, you'll forget there was ever a boundary in the first place.

## [JetBrains IDEs](https://arktype.io/docs/intro/setup#jetbrains-ides)

### [Extension (optional)](https://arktype.io/docs/intro/setup#extension-optional-1)

[ArkType](https://plugins.jetbrains.com/plugin/27099-arktype) provides the embedded syntax highlighting you are familiar
with for typescript types.

## [Other editors](https://arktype.io/docs/intro/setup#other-editors)

If you're using a different editor, we'd love [help adding support](https://github.com/arktypeio/arktype/issues/989). In
the meantime, don't worry- ArkType still offers best-in-class DX anywhere TypeScript is supported.

[Your First Type\\ \\ Next Page](https://arktype.io/docs/intro/your-first-type)

### On this page

[Installation](https://arktype.io/docs/intro/setup#installation) [VSCode](https://arktype.io/docs/intro/setup#vscode)
[Settings](https://arktype.io/docs/intro/setup#settings)
[Extension (optional)](https://arktype.io/docs/intro/setup#extension-optional)
[JetBrains IDEs](https://arktype.io/docs/intro/setup#jetbrains-ides)
[Extension (optional)](https://arktype.io/docs/intro/setup#extension-optional-1)
[Other editors](https://arktype.io/docs/intro/setup#other-editors)
