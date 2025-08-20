// Empty module for Node.js modules that are not available in the browser
export const open = () => Promise.resolve();
export const stat = () => Promise.resolve();
export const join = (...args) => args.join('/');
export const unlink = () => Promise.resolve();
export const writeFile = () => Promise.resolve();
export const readFile = () => Promise.resolve('');
export const spawn = () => null;

export default {
  open,
  stat,
  join,
  unlink,
  writeFile,
  readFile,
  spawn,
};