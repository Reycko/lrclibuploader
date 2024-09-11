import c from 'ansi-colors';

export function prettyLog(msg: string): void {
  console.log(`[${c.bold.green('LOG')}]: ${c.green(msg)}`);
}

export function prettyWarn(msg: string): void {
  console.log(`[${c.bold.yellow('WARN')}]: ${c.yellow(msg)}`);
}

export function prettyError(msg: string): void {
  console.log(`[${c.bold.red('ERROR')}]: ${c.yellow(msg)}`);
}
