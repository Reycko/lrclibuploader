import { Lyric } from '+/lyric';
/**
 * Simple container class for full lyrics
 */
export default class Lyrics {
  public lyrics: Lyric[];

  constructor(lyrics: Lyric[]) {
    this.lyrics = lyrics;
  }

  public toString() {
    //return this.lyrics.map((l) => (l.time < 0 ? l.text : `[${l.time.toString()}] `)).join('\n');
    return this.lyrics.map((l) =>
      +l.time < 0 ? l.text : `[${l.time}] ${l.text}`,
    );
  }

  public valueOf(): boolean {
    return this.lyrics.length > 0;
  }

  public syncedLines(): number {
    let r = 0;
    this.lyrics.map((v) => {
      if (+v.time >= 0) r++;
    });

    return r;
  }

  public plainLines(): number {
    let r = 0;
    this.lyrics.map((v) => {
      if (+v.time < 0) r++;
    });

    return r;
  }
}
