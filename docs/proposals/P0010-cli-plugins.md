# Proposal P0010: CLI with plugins

- Status: **DRAFT**
- Prerequisites:
  - P0005: Plugin Host

Implement pluggable commands for @w-ai/cli.

## CLI

```shell
w-ai <command> [...command-argv]
```

When called without arguments, `w-ai` implies a single default argument `help`, and executes it as a command. No
additional verification is done wrt command existence.

## `@w-ai/cli-plugin-help`

Commands:

- `help` prints `IPluginHost.description`, followed by a list of available commands and their descriptions

## Discovery

CLI Plugins are automatically discovered by package name prefix: either `@w-ai/cli-plugin-*` (official), or
`w-ai-cli-plugin-*` (community).
