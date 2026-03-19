<p align="left">
    <img width="1280" height="192" alt="wordmark-color-transparent-1280x192" src="https://github.com/user-attachments/assets/d51c038f-7822-4ee4-beb8-f438894f7736" />
    <img width="1280" height="192" alt="wordmark-color-transparent-1280x192" src="https://github.com/user-attachments/assets/d51c038f-7822-4ee4-beb8-f438894f7736" />
</p>

# @declareui/cli

Command-line tool for building, validating, and managing DeclareUI components.

---

## Installation

```bash
# Global
pnpm add -g @declareui/cli

# Or use directly
npx @declareui/cli
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
| [`@declareui/core`](https://github.com/declare-ui/core) | Parser, AST, and code generators |
| [`@declareui/mcp`](https://github.com/declare-ui/mcp) | MCP server for AI agents |
| [`create-declareui`](https://github.com/declare-ui/create-declareui) | Scaffolding tool |

## Contributing

See [CONTRIBUTING.md](https://github.com/declare-ui/.github/blob/main/CONTRIBUTING.md) for guidelines.

## License

MIT
