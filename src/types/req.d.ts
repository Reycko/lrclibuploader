declare namespace LRC.Requests {
  export type Publish = {
    trackName: string;
    artistName: string;
    albumName: string;
    duration: number;
    plainLyrics: string;
    syncedLyrics: string;
  };
}

declare namespace LRC.Responses {
  export type Publish = {
    code?: number;
    name?: string;
    message?: string;
  };

  export type Challenge = {
    prefix?: string;
    target?: string;
  };
}
