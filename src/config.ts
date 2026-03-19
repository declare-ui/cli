import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

export interface DeclareUIConfig {
  project: { name: string; prefix: string };
  source: { components: string };
  output: { dir: string; targets: string[] };
}

const CONFIG_FILENAME = 'declareui.config.yaml';

export function readConfig(cwd?: string): DeclareUIConfig {
  const dir = cwd ?? process.cwd();
  const configPath = resolve(dir, CONFIG_FILENAME);

  let content: string;
  try {
    content = readFileSync(configPath, 'utf-8');
  } catch {
    throw new Error(
      `Config file not found: ${configPath}\n` +
      `Run "declareui init" to create a new project.`
    );
  }

  const raw = yaml.load(content) as DeclareUIConfig;

  if (!raw?.project?.name) {
    throw new Error(`Invalid config: missing "project.name" in ${configPath}`);
  }
  if (!raw?.source?.components) {
    throw new Error(`Invalid config: missing "source.components" in ${configPath}`);
  }
  if (!raw?.output?.dir || !raw?.output?.targets?.length) {
    throw new Error(`Invalid config: missing "output.dir" or "output.targets" in ${configPath}`);
  }

  return raw;
}
