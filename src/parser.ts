import { Lyrics } from '@/lyrics';
import { Lyric } from '+/lyric';

export function parseTime(from: number): string {
  const minutes: number = Math.floor(from / 1000 / 60) % 60;
  const seconds: number = Math.floor(from / 1000) % 60;
  const ms: number = from % 1000;

  // Don't enforce ms to be 4 digits, minimum 2.
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padEnd(2, '0')}`;
}

export function parseLyric(raw: string): Lyric {
  const regex: RegExpExecArray | null =
    /\[([0-9]{1,2}):([0-9]{1,2})\.([0-9]{1,4})\](.*)/g.exec(raw);
  if (!regex) return { text: raw, time: 0, synced: false, string: raw };

  const [, rawMinutes, rawSeconds, rawMs, rawText] = regex;
  const [minutes, seconds, ms, text] = [
    parseInt(rawMinutes),
    parseInt(rawSeconds),
    parseInt(rawMs.padEnd(4, '0')),
    rawText.trim(),
  ];
  /* eslint-disable-next-line prettier/prettier */ /* < For readability */
  const time = (minutes * 1000 * 60) + (seconds * 1000) + ms;
  return {
    text,
    time,
    synced: true,
    string: `[${parseTime(time)}] ${text}`,
  };
}

export function parseLyrics(rawLyrics: string): Lyrics {
  const parsed: Lyric[] = rawLyrics
    .replaceAll('\r\n', '\n')
    .split('\n')
    .map(parseLyric);

  return new Lyrics(parsed ?? []);
}
