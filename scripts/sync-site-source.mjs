// Checkout-local publishing utility. Credentials arrive only over hidden stdin.
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

if (process.stdin.isTTY) spawnSync('stty', ['-echo'], {stdio: 'inherit'});
process.stdout.write('Ready for Sites Git input (hidden).\n');
let input = '';
for await (const chunk of process.stdin) {
  input += chunk.toString();
  if (input.includes('\n')) break;
  if (input.length > 1_000_000) throw new Error('Input exceeds limit');
}
const {credential, checkout, project_id} = JSON.parse(input.trim());
const directory = resolve(checkout);
const manifest = JSON.parse(readFileSync(resolve(directory, '.openai/hosting.json'), 'utf8'));
if (manifest.project_id !== project_id) throw new Error('Site identity mismatch');
const remote = spawnSync('git', ['remote', 'get-url', 'origin'], {cwd: directory, encoding: 'utf8'});
if (remote.status !== 0 || remote.stdout.trim() !== credential.remote_url) throw new Error('Source remote mismatch');
if (!/^[\w/.-]+$/.test(credential.branch)) throw new Error('Invalid source branch');
const env = {...process.env, GIT_TERMINAL_PROMPT: '0'};
if (credential.auth_mode === 'http_extra_header') Object.assign(env, {
  GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'http.extraHeader',
  GIT_CONFIG_VALUE_0: `Authorization: Bearer ${credential.token}`,
});
else if (credential.auth_mode !== 'work_proxy') throw new Error('Unsupported credential mode');
const result = spawnSync('git', ['push', 'origin', `HEAD:refs/heads/${credential.branch}`], {
  cwd: directory, env, encoding: 'utf8', timeout: 180_000,
});
const safe = text => credential.token ? text?.replaceAll(credential.token, '[REDACTED]') : text;
if (result.stdout) process.stdout.write(safe(result.stdout));
if (result.stderr) process.stderr.write(safe(result.stderr));
if (result.status !== 0) process.exit(result.status || 1);
const head = spawnSync('git', ['rev-parse', 'HEAD'], {cwd: directory, encoding: 'utf8'});
process.stdout.write(`Source commit: ${head.stdout.trim()}\n`);
