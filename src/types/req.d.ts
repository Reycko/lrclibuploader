export type PublishRequest = {
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  plainLyrics: string;
  syncedLyrics: string;
};

export type PublishResponse = {
  code?: number;
  name?: string;
  message?: string;
};

export type ChallengeResponse = {
  prefix?: string;
  target?: string;
};
