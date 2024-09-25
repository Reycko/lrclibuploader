import { Lyric } from 'lyric';
/**
 * Simple container class for full lyrics
 */
export default class Lyrics {
  public lyrics: Lyric[];

  constructor(lyrics: Lyric[]) {
    this.lyrics = lyrics;
  }

  /** Returns indexes for the `lyrics` array. */
  public get syncedLines(): number[] {
    const r: number[] = [];
    this.lyrics.map((v, i) => {
      if (+v.time >= 0) r.push(i);
    });

    return r;
  }

  /** Returns indexes for the `lyrics` array. */
  public get plainLines(): number[] {
    const r: number[] = [];
    this.lyrics.map((v, i) => {
      if (+v.time < 0) r.push(i);
    });

    return r;
  }

  public toString(): string {
    return this.lyrics
      .map((l) => (+l.time < 0 ? l.text : `[${l.time}] ${l.text}`))
      .join('\n');
  }

  /** Returns the length of `lyrics` */
  public toNumber(): number {
    return this.lyrics.length;
  }
}
