import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readConfig } from './config.js';

describe('readConfig', () => {
  it('reads a valid config file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dui-test-'));
    writeFileSync(
      join(dir, 'declareui.config.yaml'),
      `project:
  name: "test-project"
  prefix: "dui"
source:
  components: "./components/**/*.ui.yaml"
output:
  dir: "./dist"
  targets:
    - react
    - wc
`
    );

    const config = readConfig(dir);
    expect(config.project.name).toBe('test-project');
    expect(config.project.prefix).toBe('dui');
    expect(config.source.components).toBe('./components/**/*.ui.yaml');
    expect(config.output.targets).toEqual(['react', 'wc']);
  });

  it('throws on missing config file', () => {
    const dir = mkdtempSync(join(tmpdir(), 'dui-test-'));
    expect(() => readConfig(dir)).toThrow('Config file not found');
  });
});
