const unsupported = (_name) => (..._args) => {};

// Functions
export const spawn = unsupported("spawn");
export const exec = unsupported("exec");
export const execFile = unsupported("execFile");
export const fork = unsupported("fork");
export const execSync = unsupported("execSync");
export const spawnSync = unsupported("spawnSync");
export const execFileSync = unsupported("execFileSync");
export const createHash = unsupported("execFileSync");
export const open = unsupported("open");

// Classes / symbols that libraries sometimes reference
export class ChildProcess {}
export const forkOpts = {}; // placeholder sometimes used in examples

// Default export with the same members (helps with `import cp from 'child_process'`)
export default {
  spawn,
  exec,
  execFile,
  fork,
  execSync,
  spawnSync,
  execFileSync,
  ChildProcess,
  forkOpts,
  createHash,
  open,
};