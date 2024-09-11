import c from 'ansi-colors';

export function prettyLog(msg: string, eraseLine: boolean = false): void {
  console.log(
    `${eraseLine ? '\x1b[1A\x1b[2K' : ''}[${c.bold.green('LOG')}]: ${c.green(msg)}`,
  );
}

export function prettyWarn(msg: string): void {
  console.log(`[${c.bold.yellow('WARN')}]: ${c.yellow(msg)}`);
}

export function prettyError(msg: string): void {
  console.log(`[${c.bold.red('ERROR')}]: ${c.yellow(msg)}`);
}
