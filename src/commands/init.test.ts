import { describe, it, expect, afterEach } from 'vitest';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';

const CLI_BIN = join(import.meta.dirname, '..', '..', 'dist', 'bin.js');

describe('init command', () => {
  const testDir = join(tmpdir(), `dui-init-test-${Date.now()}`);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('creates project structure with all expected files', () => {
    execSync(`node ${CLI_BIN} init ${testDir}`, { stdio: 'pipe' });

    expect(existsSync(join(testDir, 'declareui.config.yaml'))).toBe(true);
    expect(existsSync(join(testDir, 'components', 'button.ui.yaml'))).toBe(true);
    expect(existsSync(join(testDir, 'package.json'))).toBe(true);
    expect(existsSync(join(testDir, '.gitignore'))).toBe(true);
  });
});
