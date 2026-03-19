import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, basename, relative } from 'node:path';
import { glob } from 'glob';
import {
  parseComponent,
  validateComponent,
  ReactGenerator,
  WCGenerator,
  DeclareUIValidationError,
  DeclareUIParseError,
} from '@declareuihq/core';
import type { ComponentAST, GeneratedFile } from '@declareuihq/core';
import { readConfig } from '../config.js';
import { log } from '../utils/logger.js';
import { createTimer } from '../utils/timer.js';

const GENERATORS: Record<string, () => InstanceType<typeof ReactGenerator | typeof WCGenerator>> = {
  react: () => new ReactGenerator(),
  wc: () => new WCGenerator(),
};

interface BuildOptions {
  targets?: string;
  watch?: boolean;
}

async function runBuild(cwd: string, targetOverrides?: string[]): Promise<boolean> {
  const timer = createTimer();
  const config = readConfig(cwd);
  const targets = targetOverrides ?? config.output.targets;
  const sourceGlob = config.source.components;
  const outputDir = resolve(cwd, config.output.dir);

  const files = await glob(sourceGlob, { cwd });
  if (files.length === 0) {
    log.warn('No .ui.yaml files found matching: ' + sourceGlob);
    return true;
  }

  let hasErrors = false;
  let totalComponents = 0;

  for (const file of files) {
    const filePath = resolve(cwd, file);
    const source = readFileSync(filePath, 'utf-8');

    let ast: ComponentAST;
    try {
      const raw = parseComponent(source);
      ast = validateComponent(raw);
    } catch (err) {
      hasErrors = true;
      log.error(relative(cwd, filePath));
      if (err instanceof DeclareUIValidationError) {
        const location = err.path ? ` at ${err.path}` : '';
        console.log(`  → ${err.message}${location}`);
      } else if (err instanceof DeclareUIParseError) {
        console.log(`  → Parse error: ${err.message}`);
      } else {
        console.log(`  → ${(err as Error).message}`);
      }
      continue;
    }

    totalComponents++;

    for (const target of targets) {
      const generatorFn = GENERATORS[target];
      if (!generatorFn) {
        log.warn(`Unknown target "${target}", skipping`);
        continue;
      }

      const generator = generatorFn();
      let generated: GeneratedFile[];
      try {
        generated = generator.generate(ast);
      } catch (err) {
        hasErrors = true;
        log.error(`${ast.meta.name} → ${target}: ${(err as Error).message}`);
        continue;
      }

      const targetDir = join(outputDir, target);
      mkdirSync(targetDir, { recursive: true });

      for (const gf of generated) {
        const outPath = join(targetDir, gf.filename);
        writeFileSync(outPath, gf.content, 'utf-8');
        log.success(`${ast.meta.name} → ${target} (${relative(cwd, outPath)})`);
      }
    }
  }

  console.log('');
  if (hasErrors) {
    log.warn(`Built with errors in ${timer.elapsed()}`);
  } else {
    log.info(`Built ${totalComponents} component${totalComponents !== 1 ? 's' : ''} for ${targets.length} target${targets.length !== 1 ? 's' : ''} in ${timer.elapsed()}`);
  }

  return !hasErrors;
}

export function registerBuildCommand(program: import('commander').Command): void {
  program
    .command('build')
    .description('Build .ui.yaml components into target frameworks')
    .option('--targets <targets>', 'Comma-separated build targets (e.g. react,wc)')
    .option('--watch', 'Watch for changes and rebuild')
    .action(async (opts: BuildOptions) => {
      const cwd = process.cwd();
      const targets = opts.targets?.split(',').map(t => t.trim());

      const ok = await runBuild(cwd, targets);

      if (opts.watch) {
        log.info('Watching for changes...');
        const config = readConfig(cwd);

        const { watch } = await import('chokidar');
        const watcher = watch(config.source.components, {
          cwd,
          ignoreInitial: true,
        });

        const rebuild = async () => {
          console.log('');
          log.info('Change detected, rebuilding...');
          await runBuild(cwd, targets);
        };

        watcher.on('change', rebuild);
        watcher.on('add', rebuild);
        watcher.on('unlink', rebuild);
      } else if (!ok) {
        process.exit(1);
      }
    });
}
