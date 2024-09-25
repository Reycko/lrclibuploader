import * as path from 'node:path';
import * as fs from 'node:fs';
import { SongData, Config } from 'config';
import { prettyError, prettyLog, prettyWarn } from './print';
import Lyrics from '@/classes/lyrics';
import * as Parser from '@/classes/parser';
import { Lyric } from 'lyric';
import Arguments from '@/classes/arguments';
import { Result } from 'result';

function tryLoadFile(loc: fs.PathLike): Buffer | null {
  try {
    return fs.readFileSync(loc);
  } catch {
    return null;
  }
}

export function load(from?: string): Result<Config> {
  const fd = from ? from : path.resolve(__dirname, '..', 'data');
  try {
    let possibleBadLines: number[];
    const rawData: Buffer | null = tryLoadFile(path.resolve(fd, 'data.json'));

    if (!rawData) {
      prettyError("Couldn't load data.json, make sure it exists.");
      return {
        success: false,
      };
    }

    const data: SongData = JSON.parse(rawData.toString('utf-8'));
    prettyLog('Data found: ');
    console.log(data);

    const plainLyricsRaw: Buffer | null = tryLoadFile(
      path.resolve(fd, 'plain.txt'),
    );

    if (!plainLyricsRaw) {
      prettyError("Couldn't load plain.txt, make sure it exists.");
      return {
        success: false,
      };
    }

    const plainLyrics: Lyrics | null = Parser.parseLyrics(
      plainLyricsRaw.toString('utf-8').replaceAll('\r\n', '\n'), // remove CR from CRLF (Windows) line endings
    );

    if (!plainLyrics) {
      prettyError('Error while reading plain lyrics.');
      return {
        success: false,
      };
    }

    possibleBadLines = plainLyrics.syncedLines;
    if (possibleBadLines.length) {
      prettyWarn(
        `Synced: Found ${possibleBadLines.length} possible plain or badly parsed lines are aren't meant to be:`,
      );

      possibleBadLines.forEach((i) => {
        const l: Lyric = plainLyrics.lyrics[i];
        prettyWarn(`{Line ${i}}${+l.time >= 0 ? `[${l.time}] ` : ''}${l.text}`);
      });

      if (Arguments.args.strict) {
        return {
          success: false,
        };
      }
    }

    prettyLog(`Plain text lyrics found: ${plainLyrics.lyrics[0].text}\n[...]`);

    const syncedLyricsRaw: Buffer | null = tryLoadFile(
      path.resolve(fd, 'synced.txt'),
    );

    if (!syncedLyricsRaw) {
      prettyWarn('No synced lyrics.');
      return {
        success: false,
      };
    }

    const syncedLyrics: Lyrics | null = Parser.parseLyrics(
      syncedLyricsRaw.toString('utf-8').replace(/\r\n/g, '\n'), // same as above
    );

    if (!syncedLyrics) {
      prettyError('Error while reading synced lyrics.');
      return {
        success: false,
      };
    }
    possibleBadLines = syncedLyrics.plainLines;
    if (possibleBadLines.length) {
      prettyWarn(
        `Synced: Found ${possibleBadLines.length} possible plain or badly parsed lines are aren't meant to be:`,
      );

      possibleBadLines.forEach((i) => {
        const l: Lyric = syncedLyrics.lyrics[i];
        prettyWarn(`{Line ${i}}${+l.time >= 0 ? `[${l.time}] ` : ''}${l.text}`);
      });

      if (Arguments.args.strict) {
        return {
          success: false,
        };
      }
    }

    prettyLog(`Synced lyrics found: ${syncedLyrics.lyrics[0].text}\n[...]`);

    return {
      success: true,
      result: {
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
