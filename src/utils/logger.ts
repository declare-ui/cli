import pc from 'picocolors';

export const log = {
  success(msg: string): void {
    console.log(pc.green('✓') + ' ' + msg);
  },

  error(msg: string): void {
    console.error(pc.red('✗') + ' ' + msg);
  },

  warn(msg: string): void {
    console.warn(pc.yellow('!') + ' ' + msg);
  },

  info(msg: string): void {
    console.log(pc.blue('i') + ' ' + msg);
  },

  dim(msg: string): void {
    console.log(pc.dim(msg));
  },

  bold(msg: string): void {
    console.log(pc.bold(msg));
  },
};
