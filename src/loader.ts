import * as path from 'node:path';
import * as fs from 'node:fs';
import { ConfigResult, SongData } from './types/config';
import { prettyError, prettyLog, prettyWarn } from './print';

function tryLoadFile(loc: fs.PathLike): Buffer | null {
  try {
    return fs.readFileSync(loc);
  } catch {
    return null;
  }
}

export function load(from?: string): ConfigResult {
  const fd =
    typeof from === 'string' ? from : path.resolve(__dirname, '..', 'data');
  try {
    const rawData: Buffer | null = tryLoadFile(path.resolve(fd, 'data.json'));
    if (!rawData) {
      throw new Error("Couldn't load data.json, make sure it exists.");
    }

    const data: SongData = JSON.parse(rawData.toString('utf-8'));
    prettyLog('Data found: ');
    console.log(data);

    const plainLyricsRaw: Buffer | null = tryLoadFile(
      path.resolve(fd, 'plain.txt'),
    );
    if (!plainLyricsRaw) {
      throw new Error("Couldn't load plain.txt, make sure it exists.");
    }

    const plainLyrics: string = plainLyricsRaw
      .toString('utf-8')
      .replace(/\r\n/g, '\n'); // remove CR from CRLF (Windows) line endings

    prettyLog(`Plain text lyrics found: ${plainLyrics.split('\n')[0]}\n[...]`);

    const syncedLyricsRaw: Buffer | null = tryLoadFile(
      path.resolve(fd, 'synced.txt'),
    );

    let syncedLyrics: string | undefined;

    if (!syncedLyricsRaw) {
      prettyWarn('No synced lyrics.');
      return { success: false };
    } else {
      syncedLyrics = syncedLyricsRaw.toString('utf-8').replace(/\r\n/g, '\n'); // same as above
      prettyLog(`Synced lyrics found: ${syncedLyrics.split('\n')[0]}\n[...]`);
    }

    return {
      success: true,
      config: {
        data: data,
        plainLyrics: plainLyrics,
        syncedLyrics: syncedLyrics,
      },
    };
  } catch (err: Error | unknown) {
    prettyError(err as string);
    return { success: false };
  }
}
