import { describe, it, expect, afterEach } from 'vitest';
import { existsSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';

const CLI_BIN = join(import.meta.dirname, '..', '..', 'dist', 'bin.js');

describe('validate command', () => {
  const testDir = join(tmpdir(), `dui-validate-test-${Date.now()}`);

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('validates a correct component file', () => {
    execSync(`node ${CLI_BIN} init ${testDir}`, { stdio: 'pipe' });

    const output = execSync(`node ${CLI_BIN} validate`, {
      cwd: testDir,
      stdio: 'pipe',
      encoding: 'utf-8',
    });

    expect(output).toContain('valid');
    expect(output).toContain('1 valid, 0 invalid');
  });

  it('reports invalid component files with exit code 1', () => {
    execSync(`node ${CLI_BIN} init ${testDir}`, { stdio: 'pipe' });

    // Create an invalid component file
    writeFileSync(
      join(testDir, 'components', 'broken.ui.yaml'),
      'not_a_valid_component: true\n'
    );

    try {
      execSync(`node ${CLI_BIN} validate`, {
        cwd: testDir,
        stdio: 'pipe',
        encoding: 'utf-8',
      });
      expect.fail('Should have exited with code 1');
    } catch (err: any) {
      expect(err.status).toBe(1);
      const output = err.stdout?.toString() ?? '';
      expect(output).toContain('1 invalid');
    }
  });
});
