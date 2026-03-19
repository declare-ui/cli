import { readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { glob } from 'glob';
import {
  parseComponent,
  validateComponent,
  DeclareUIValidationError,
  DeclareUIParseError,
} from '@declareui/core';
import { readConfig } from '../config.js';
import { log } from '../utils/logger.js';

export function registerValidateCommand(program: import('commander').Command): void {
  program
    .command('validate [glob]')
    .description('Validate .ui.yaml component files')
    .action(async (globPattern?: string) => {
      const cwd = process.cwd();

      let pattern: string;
      if (globPattern) {
        pattern = globPattern;
      } else {
        const config = readConfig(cwd);
        pattern = config.source.components;
      }

      const files = await glob(pattern, { cwd });
      if (files.length === 0) {
        log.warn('No .ui.yaml files found matching: ' + pattern);
        process.exit(0);
      }

      let valid = 0;
      let invalid = 0;

      for (const file of files) {
        const filePath = resolve(cwd, file);
        const source = readFileSync(filePath, 'utf-8');

        try {
          const raw = parseComponent(source);
          validateComponent(raw);
          log.success(`${relative(cwd, filePath)} — valid`);
          valid++;
        } catch (err) {
          invalid++;
          log.error(relative(cwd, filePath));
          if (err instanceof DeclareUIValidationError) {
            const location = err.path ? ` at ${err.path}` : '';
            console.log(`  → ${err.message}${location}`);
          } else if (err instanceof DeclareUIParseError) {
            console.log(`  → Parse error: ${err.message}`);
          } else {
            console.log(`  → ${(err as Error).message}`);
          }
        }
      }

      console.log('');
      log.info(`Validated ${files.length} file${files.length !== 1 ? 's' : ''}: ${valid} valid, ${invalid} invalid`);

      if (invalid > 0) {
        process.exit(1);
      }
    });
}
