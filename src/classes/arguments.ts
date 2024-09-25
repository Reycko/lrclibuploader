import * as Commander from 'commander';
import { ArgumentsType } from '@/types/arguments';
import { VERSION as version } from '@/consts';

export default class Arguments {
  private static _initialized: boolean;
  private static _args: ArgumentsType;

  public static get initialized(): boolean {
    return this._initialized;
  }

  public static get args(): ArgumentsType {
    return this._args;
  }

  static initialize(then: (args: ArgumentsType) => void) {
    Commander.program
      .name('lrclibuploader')
      .description('Easily upload lyrics to LRCLib.')
      .version(version.toString());

    Commander.program
      .option('-d, --dry-run', "Dry run: Don't upload to LRCLib.", false)
      .option('-s, --strict', 'Exit program if a lyric is badly parsed.', true)
      .action(() => {
        this._args = Commander.program.opts<ArgumentsType>();
        then(this.args);
      });

    Commander.program.parse();
  }
}
