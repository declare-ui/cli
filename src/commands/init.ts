import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { log } from '../utils/logger.js';

const CONFIG_TEMPLATE = (name: string) => `project:
  name: "${name}"
  prefix: "dui"

source:
  components: "./components/**/*.ui.yaml"

output:
  dir: "./dist"
  targets:
    - react
    - wc
`;

const BUTTON_TEMPLATE = `component: Button
version: "1.0.0"
description: "A simple button component"

props:
  variant:
    type: enum
    values: [primary, secondary, ghost]
    default: primary
  label:
    type: string
    required: true
  disabled:
    type: boolean
    default: false

template:
  tag: button
  attrs:
    type: button
    disabled: "$props.disabled"
  classes:
    base: "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors"
    variants:
      variant:
        primary: "bg-blue-600 text-white hover:bg-blue-700"
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100"
    conditionals:
      - when: "$props.disabled"
        add: "opacity-50 cursor-not-allowed"
  children:
    - tag: span
      content: "$props.label"
`;

const PACKAGE_JSON_TEMPLATE = (name: string) => JSON.stringify(
  {
    name,
    private: true,
    type: 'module',
    scripts: {
      build: 'declareui build',
      validate: 'declareui validate',
    },
    devDependencies: {
      '@declareuihq/cli': '^0.1.0-alpha.1',
    },
  },
  null,
  2,
) + '\n';

const GITIGNORE_TEMPLATE = `node_modules/
dist/
.DS_Store
`;

export function registerInitCommand(program: import('commander').Command): void {
  program
    .command('init [project-name]')
    .description('Create a new DeclareUI project')
    .action((projectName?: string) => {
      const name = projectName ?? 'my-declareui-project';
      const projectDir = resolve(name);

      try {
        mkdirSync(join(projectDir, 'components'), { recursive: true });

        writeFileSync(join(projectDir, 'declareui.config.yaml'), CONFIG_TEMPLATE(name));
        writeFileSync(join(projectDir, 'components', 'button.ui.yaml'), BUTTON_TEMPLATE);
        writeFileSync(join(projectDir, 'package.json'), PACKAGE_JSON_TEMPLATE(name));
        writeFileSync(join(projectDir, '.gitignore'), GITIGNORE_TEMPLATE);

        console.log('');
        log.success(`Created ${name}/`);
        log.dim('  ├── declareui.config.yaml');
        log.dim('  ├── components/button.ui.yaml');
        log.dim('  ├── package.json');
        log.dim('  └── .gitignore');
        console.log('');
        log.bold('  Next steps:');
        log.dim(`    cd ${name}`);
        log.dim('    pnpm install');
        log.dim('    declareui build');
        console.log('');
      } catch (err) {
        log.error(`Failed to create project: ${(err as Error).message}`);
        process.exit(1);
      }
    });
}
