import { Lyric } from '+/lyric';
/**
 * Simple container class for full lyrics
 */
export class Lyrics {
  public lyrics: Lyric[];

  constructor(lyrics: Lyric[]) {
    this.lyrics = lyrics;
  }

  public toString() {
    return this.lyrics.join('\n');
  }

  public valueOf(): boolean {
    return this.lyrics.length > 0;
  }

  public syncedLines(): number {
    let r = 0;
    this.lyrics.map((v) => {
      if (v.synced) r++;
    });

    return r;
  }

  public plainLines(): number {
    let r = 0;
    this.lyrics.map((v) => {
      if (!v.synced) r++;
    });

    return r;
  }
}
