import { describe, it, expect, afterEach } from 'vitest';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';

const CLI_BIN = join(import.meta.dirname, '..', '..', 'dist', 'bin.js');

describe('build command', () => {
  const testDir = join(tmpdir(), `dui-build-test-${Date.now()}`);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('builds component files for all configured targets', () => {
    // Init project first
    execSync(`node ${CLI_BIN} init ${testDir}`, { stdio: 'pipe' });

    // Run build
    const output = execSync(`node ${CLI_BIN} build`, {
      cwd: testDir,
      stdio: 'pipe',
      encoding: 'utf-8',
    });

    expect(output).toContain('Button');
    expect(existsSync(join(testDir, 'dist', 'react', 'button.tsx'))).toBe(true);
    expect(existsSync(join(testDir, 'dist', 'wc', 'button.ts'))).toBe(true);
  });
});
