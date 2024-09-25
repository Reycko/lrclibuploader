import 'lyric';
import { Lyrics } from '@/classes/lyrics';

export type SongData = {
  trackName: string;
  artistName: string;
  albumName: string | null;
  duration: number;
};

export type Config = {
  data: SongData;
  plainLyrics: Lyrics;
  syncedLyrics: Lyrics;
};
