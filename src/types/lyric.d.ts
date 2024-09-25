import Time from '@/classes/time';

export type Lyric = {
  text: string;
  /** In milliseconds, less than 0 = not synced */
  time: Time;
};
