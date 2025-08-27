# Proposal P005: Plugin Host

- Status: **DRAFT**

Implement CLI plugin host interface for W-AI.

## Plugin Discovery

CLI Plugins are automatically discovered by package name prefix: either `@w-ai/cli-plugin-*` (official), or
`w-ai-cli-plugin-*` (community).

## Plugin Lifetime

Plugins are treated as static singletons. All available plugins are loaded at once. There is no init nor dispose.

This approach is simple and covers all currently envisioned use cases.

## Plugin Entities

Plugins provide entities to the Host and other plugins. We will be providing runnable CLI commands and asset files.

Asset files will later be further specialized by type.

### CLI Commands

Normal CLI stuff. Command has interface that accepts argv.

Illustration:

```text
w-ai --foo qux bar --baz quo
```

- `--foo qux` is an option for w-ai host
- `bar` is a command
- `--baz` is an option for `bar`
- `quo` is an argument

Parsing ambiguity is resolved by option configuration, as usual.

The host program (`@w-ai/cli`) does not implement any commands itself.

When run without arguments, it executes default command `help`, without validation of its existence. However,
`@w-ai/cli` package depends on `@w-ai/cli-plugin-help`, which provides the command.

If host does not find a command, it fails with an error message.

All commands are introspectable by host and other plugins.

### Asset Files

Plugins expose asset files as data with URIs, relative to the plugin itself.

Assets are read-only.

Host does not access any asset files directly on the filesystem, allowing in the future plugins to virtualize
filesystems, etc.

Plugins that contribute assets, store asset files in `assets/` directory, which is then duly included in `package.json`
files.

Host does not inspect plugin `package.json` files.

All assets are introspectable by host and other plugins.

There is a plugin that provides assets from the project root (`.w-ai/assets`).

### Unknown Entities

The host keeps a registry of known asset types, for type safety. Plugins may provide other assets by using the `unknown`
type. Such plugins should then implement their own type-safe system for managing the assets.

Note that the current URI system does not go out of its way to make this easy. OTOH, there is no need for unknown assets
currently envisioned.

### Unified Access

"Everything is a file", almost.

Host unifies plugin entities into a single virtual "filesystem", allowing for unified lookup and access.

Full entity URI is:

- `w-ai:/cli:/command:/@w-ai/cli-plugin-help/:/help`
- `w-ai:/cli:/asset:/@w-ai/cli-plugin-dot-w-ai/:/artefact/unknown.yaml`

Plugins without `@` in the name get an `@` subdirectory to keep the number of plugin path fragments consistent:

- `w-ai:/cli:/command:/@/wai-cli-plugin-foo/:/bar`

Notes:

- Slashes after `:` are added in hope that they would play nicer with `minimatch` and `ignore`.
- `:/` after plugin name is a placeholder for future asset subtypes (e.g `artefact:`), structured this way to facilitate
  easier globbing.

#### Path Conflict Resolution

While all entities are technically unique, some, like commands, share flat namespaces. What if there are two plugins
which export the `help` command?

We let users define namespace conflict resolution logic, and always return matched uri lists.

Standalone helper functions for common cases are provided via`@w-ai/lib-cli-plugin`. As a policy, any reasonably
reusable resolution logic used by official plugins, should be accessible to community plugins, to facilitate code reuse.

##### Assets

Users provide any tail part of the asset URI to match, optionally excluding the file extension. All URIs matching the
tail are included in the result.

E.g. `foo/bar` matches `w-ai:/cli:/asset:/*/*/*:/**/foo/bar{,.*}`.

Ideally we rely on glob-esque patterns to handle that. (TODO: Refine paragraph)

When several assets are matched, users are prompted with potential matches to specialize the tail by including more of
it.

NOTE: YAGNI. We specify this asset conflict resolution as an example, actual logic will depend on asset subtype later.
Do not implement.

##### Commands

Users provide any HEAD part of the command URI (sans plugin and subtype) to match. E.g. `foo/bar` matches
`w-ai:/cli:/command:/*/*/:/foo/bar`.

When there are several matches (due to several plugins provided commands with the same prefix), users are prompted with
potential matches to specialize the head by including more of it.

##### Help Subcommand

Help command looks for subcommands in the `*-help:` asset sub-type.

- `help plugin foo` looks in `w-ai:/cli:/command:/*/*/:help/plugin/**/*foo*`.

- `help command bar` looks in `w-ai:/cli/command:/*/*/:help/command/**/*bar*`.

On several matches, if there is an exact match among them, (e.g. `w-ai:/cli:/command:/*/*/:help/plugin/foo`), it is
treated as a single match. (Implementation might choose to perform smarter lookups.)

## CLI Plugin Host Interface

Sketch (obsolete):

```ts
// TODO: Namespace away the hungarians.
// Pick better types, if any
type CLIPluginURI = string;
type CLIPluginEntityURI = string;

// TODO: This should map to types. Use branded?
type ICLIPluginEntityType = 'unknown' | 'command' | 'asset';

interface ICLIPluginEntity<T extends unknown = unknown> {
  readonly uri: CLIPluginEntityURI;
  readonly type: ICLIPluginEntityType;
  readonly value: T;
}

interface ICLIPlugin {
  readonly id: CLIPluginURI; // Must be set to package.name
  readonly name: string; // cli command group name
  readonly description: string; // package.description
  // Boring. Expose entity collections?
  readonly provides: Map<ICLIPluginEntityType, Set<CLIPluginEntityURI>>;
  resolve<T extends ICLIPluginEntity>(type: ICLIPluginEntityType, uri: string): T | undefined;
}

type ICLIPluginRecord = Record<ICLIPluginURI, ICLIPlugin>;

interface ICLIPluginHost {
  readonly id: string; // package.name
  readonly name: string; // cli executable name
  readonly description: string; // package.description
  readonly plugins: ICLIPluginRecord;
  // These should go into entity collections.
  resolve<T extends ICLIPluginEntity>(uri: string): T | undefined;
  glob<T extends ICLIPluginEntity>(pattern: string): T[];
}
```

## Implementations

Sketch (obsolete):

```ts
class CLIPluginHost implements ICLIPluginHost {
  private entities: Map<CLIPluginEntityURI, CLIPluginURI>; // Ugh.
  constructor(plugins: ICLIPluginRecord);
  static fromInstalledNodeModules(): CLIPluginHost;
  // ...
}
```
