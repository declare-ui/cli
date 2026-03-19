import { createRequire } from 'node:module';
import { Command } from 'commander';
import { registerInitCommand } from './commands/init.js';
import { registerBuildCommand } from './commands/build.js';
import { registerValidateCommand } from './commands/validate.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();

program
  .name('declareui')
  .description('DeclareUI CLI — build UI components from YAML definitions')
  .version(pkg.version);

registerInitCommand(program);
registerBuildCommand(program);
registerValidateCommand(program);

program.parse();
