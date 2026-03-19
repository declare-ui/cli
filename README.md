<p align="left">
    <img width="1280" height="192" alt="DeclareUI" src="https://github.com/user-attachments/assets/d51c038f-7822-4ee4-beb8-f438894f7736#gh-light-mode-only" />
    <img width="1280" height="192" alt="DeclareUI" src="https://github.com/user-attachments/assets/44918531-3b1b-4ace-bca0-db0ea99f8bc8#gh-dark-mode-only" />
</p>

# @declareuihq/cli

Command-line tool for building, validating, and managing DeclareUI components.

---

## Installation

```bash
# Global
pnpm add -g @declareuihq/cli

# Or use directly
npx @declareuihq/cli
```

## Commands

```bash
# Initialize a new DeclareUI project
declareui init my-design-system

# Build components for target frameworks
declareui build --targets react,vue,svelte,angular,wc

# Validate component declarations
declareui validate

# Preview components in the browser
declareui preview

# Generate documentation from components
declareui docs

# Run component tests
declareui test
```

## Quick start

```bash
declareui init my-project
cd my-project
declareui build --targets react,vue
```

This creates a project with example components and builds native React and Vue code from your `.ui.yaml` declarations.

## Configuration

Create a `declareui.config.yaml` at your project root:

```yaml
targets:
  - react
  - vue
  - svelte
output: ./generated
typescript: true
tailwind: true
```

## Related packages

| Package | Description |
|:--------|:------------|
| [`@declareuihq/core`](https://github.com/declare-ui/core) | Parser, AST, and code generators |
| [`@declareuihq/mcp`](https://github.com/declare-ui/mcp) | MCP server for AI agents |
| [`create-declareui`](https://github.com/declare-ui/create-declareui) | Scaffolding tool |

## Contributing

See [CONTRIBUTING.md](https://github.com/declare-ui/.github/blob/main/CONTRIBUTING.md) for guidelines.

## License

MIT
