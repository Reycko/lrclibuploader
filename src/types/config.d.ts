export type SongData = {
  trackName: string;
  artistName: string;
  albumName?: string;
  duration: number;
};

export type Config = {
  data: SongData;
  plainLyrics: string;
  syncedLyrics: string;
};

export type ConfigResult = {
  success: boolean;
  config?: Config;
};
