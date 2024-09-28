import { program } from 'commander';
import { VERSION as version } from '@/consts';

declare global {
  namespace Arguments {
    export type Args = {
      strict: boolean;
      dryRun: boolean;
    };

    // Is this a bad idea?
    export class Reader {
      private static _initialized: boolean;
      private static _args: Arguments.Args;

      public static get initialized(): boolean {
        return this._initialized;
      }

      public static get args(): Arguments.Args {
        return this._args;
      }

      static initialize(then: (args: Arguments.Args) => void) {
        program
          .name('lrclibuploader')
          .description('Easily upload lyrics to LRCLib.')
          .version(version.toString());

        program
          .option('-d, --dry-run', "Dry run: Don't upload to LRCLib.", false)
          .option('-s, --strict', 'Exit program if a lyric is badly parsed.', true) // eslint-disable-line prettier/prettier
          .action(() => {
            this._args = program.opts<Arguments.Args>();
            then(this.args);
          });

        program.parse();
      }
    }
  }
}
