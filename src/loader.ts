import * as path from 'node:path';
import * as fs from 'node:fs';
import { ConfigResult, SongData } from './types/config';

export class Loader {
  public static load(from?: string): ConfigResult {
    const fd =
      typeof from === 'string' ? from : path.resolve(__dirname, '..', 'data');

    try {
      const data: SongData = JSON.parse(
        fs.readFileSync(path.resolve(fd, 'data.json')).toString(),
      );

      const plainLyrics: string = fs
        .readFileSync(path.resolve(fd, 'plain.txt'))
        .toString('utf-8')
        .replace('\r\n', '\n'); // move CR from CRLF (Windows) line endings

      const syncedLyrics: string = fs
        .readFileSync(path.resolve(fd, 'synced.txt'))
        .toString('utf-8')
        .replace('\r\n', '\n'); // same as above

      return {
        success: true,
        config: {
          data: data,
          plainLyrics: plainLyrics,
          syncedLyrics: syncedLyrics,
        },
      };
    } catch (err) {
      console.log('An error occured:');
      console.error(err);
      return { success: false };
    }
  }
}
