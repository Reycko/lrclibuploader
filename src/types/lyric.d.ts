import Time from '@/classes/time';

// TODO: find a scope to export this at in a namespace
export type Lyric = {
  text: string;
  /** In milliseconds, less than 0 = not synced */
  time: Time;
};
