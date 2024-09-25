import * as path from 'node:path';
import * as fs from 'node:fs';
import { ConfigResult, SongData } from '+/config';
import { prettyError, prettyLog, prettyWarn } from './print';
import Lyrics from '@/lyrics';
import * as parser from './parser';

function tryLoadFile(loc: fs.PathLike): Buffer | null {
  try {
    return fs.readFileSync(loc);
  } catch {
    return null;
  }
}

export function load(from?: string): ConfigResult {
  const fd = from ? from : path.resolve(__dirname, '..', 'data');
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
      prettyError("Couldn't load plain.txt, make sure it exists.");
      return {
        success: false,
      };
    }

    const plainLyrics: Lyrics | null = parser.parseLyrics(
      plainLyricsRaw.toString('utf-8').replaceAll('\r\n', '\n'), // remove CR from CRLF (Windows) line endings
    );

    if (!plainLyrics) {
      prettyError('Error while reading plain lyrics.');
      return {
        success: false,
      };
    } else {
      const possibleBadLines: number = plainLyrics.syncedLines();
      if (possibleBadLines) {
        prettyWarn(
          `Plain: Found ${possibleBadLines} possible synced lines that aren't meant to be.`,
        );
      }
      prettyLog(
        `Plain text lyrics found: ${plainLyrics.lyrics[0].text}\n[...]`,
      );
    }

    const syncedLyricsRaw: Buffer | null = tryLoadFile(
      path.resolve(fd, 'synced.txt'),
    );

    if (!syncedLyricsRaw) {
      prettyWarn('No synced lyrics.');
      return {
        success: false,
      };
    }

    const syncedLyrics: Lyrics | null = parser.parseLyrics(
      syncedLyricsRaw.toString('utf-8').replace(/\r\n/g, '\n'), // same as above
    );
    if (!syncedLyrics) {
      prettyError('Error while reading synced lyrics.');
      return {
        success: false,
      };
    }
    const possibleBadLines: number = syncedLyrics.plainLines();
    if (possibleBadLines) {
      prettyWarn(
        `Synced: Found ${possibleBadLines} possible plain or badly parsed lines are aren't meant to be.`,
      );
    }
    prettyLog(`Synced lyrics found: ${syncedLyrics.lyrics[0].text}\n[...]`);

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
