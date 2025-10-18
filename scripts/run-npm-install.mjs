#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[install] ${ts} ${msg}`);
}

function logErr(msg) {
  const ts = new Date().toISOString();
  console.error(`[install] ${ts} ${msg}`);
}

function detectPackageManager() {
  const has = (f) => existsSync(join(cwd, f));
  if (has('pnpm-lock.yaml')) return { name: 'pnpm', installArgs: ['install'] };
  if (has('yarn.lock')) return { name: 'yarn', installArgs: ['install'] };
  if (has('bun.lockb')) return { name: 'bun', installArgs: ['install'] };
  if (has('package-lock.json')) {
    // Prefer `ci` in CI if package-lock exists
    if (process.env.CI) return { name: 'npm', installArgs: ['ci'] };
    return { name: 'npm', installArgs: ['install'] };
  }
  return { name: 'npm', installArgs: ['install'] };
}

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    log(`Running: ${cmd} ${args.join(' ')}`);
    const child = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        npm_config_audit: 'false',
        npm_config_fund: 'false',
        npm_config_loglevel: process.env.CI ? 'info' : 'notice',
        npm_config_yes: 'true',
      },
      ...options,
    });
    child.on('error', (err) => {
      reject(err);
    });
    child.on('close', (code, signal) => {
      if (code === 0) return resolve({ code });
      const err = new Error(`Command failed: ${cmd} ${args.join(' ')} (code ${code}${signal ? `, signal ${signal}` : ''})`);
      err.code = code;
      err.signal = signal;
      reject(err);
    });
  });
}

function looksNetworkRelated(text = '') {
  const patterns = [
    'ETIMEDOUT',
    'ECONNRESET',
    'ENOTFOUND',
    'EAI_AGAIN',
    'network timeout',
    'socket timeout',
    'ERR_SOCKET_TIMEOUT',
    '504',
    '502',
    'fetch failed',
  ];
  const lower = String(text).toLowerCase();
  return patterns.some((p) => lower.includes(p.toLowerCase()));
}

async function main() {
  const { name: pm, installArgs } = detectPackageManager();
  const baseArgs = [...installArgs];

  // Prefer deterministic installs where possible
  if (pm === 'npm' && installArgs[0] === 'install') {
    baseArgs.push('--no-audit', '--no-fund');
  }

  let lastErrorText = '';

  // Try up to 3 times on transient failures
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await run(pm, baseArgs);
      log('Dependencies installed successfully.');
      return;
    } catch (err) {
      const text = `${err.message || ''}`;
      lastErrorText = text;
      const isTransient = looksNetworkRelated(text);

      if (pm === 'npm' && text.includes('ERESOLVE')) {
        logErr('Peer dependency resolution failed (ERESOLVE). Retrying with --legacy-peer-deps...');
        try {
          await run('npm', [...installArgs, '--legacy-peer-deps', '--no-audit', '--no-fund']);
          log('Dependencies installed successfully with --legacy-peer-deps.');
          return;
        } catch (e2) {
          lastErrorText = `${e2.message || ''}`;
        }
      }

      if (attempt < maxAttempts && isTransient) {
        const backoff = attempt * 2000;
        logErr(`Install failed (attempt ${attempt}/${maxAttempts}). Looks transient. Waiting ${backoff}ms and retrying...`);
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }

      logErr(`Install failed${isTransient ? ' after retries' : ''}.`);
      logErr('Helpful tips:');
      logErr('- Check your internet connection or npm registry availability.');
      logErr('- Ensure you are using a supported Node.js version (see package.json engines if specified).');
      logErr('- Clear cache: npm cache clean --force');
      logErr('- If peer dependency conflicts persist, try: npm install --legacy-peer-deps');
      process.exit(typeof err.code === 'number' && err.code !== 0 ? err.code : 1);
    }
  }

  // Should not reach here, but just in case
  logErr('Install failed with unknown error.');
  if (lastErrorText) logErr(lastErrorText);
  process.exit(1);
}

main().catch((e) => {
  logErr(`Unexpected error: ${e?.stack || e?.message || e}`);
  process.exit(1);
});
