export default class Time {
  // @ts-expect-error Set through `time` setter.
  private _time: number;

  public get time(): number {
    return this._time;
  }

  public set time(from: string | number) {
    if (typeof from === 'string') {
      const parse: number = Time.parse(from);
      if (parse < 0) this._time = -1;
    }
    if (typeof from === 'number') {
      this._time = Math.max(from, -1);
    }
  }

  public static parse(t: string | number): number {
    if (typeof t === 'string') {
      const regex: RegExpExecArray | null =
        /([0-9]{1,2}):([0-9]{1,2})\.([0-9]{1,4})/g.exec(t);

      if (!regex) return -1;

      const [, rawMinutes, rawSeconds, rawMs] = regex;
      const [minutes, seconds, ms] = [
        parseInt(rawMinutes),
        parseInt(rawSeconds),
        parseInt(rawMs),
      ];

      // eslint-disable-next-line prettier/prettier
      return Math.max((minutes * 1000 * 60) + (seconds * 1000) + ms, -1);
    }

    if (typeof t === 'number') return t;

    return -1;
  }

  constructor(t: number);
  constructor(t: string);
  constructor(t: number | string) {
    this.time = Time.parse(t);
  }

  public toString(): string {
    if (this.time < 0) return '<invalid>';
    const minutes: number = Math.floor(this.time / 1000 / 60);
    const seconds: number = Math.floor(this.time / 1000) % 60;
    const ms: number = this.time % 1000;

    // Don't enforce ms to be 4 digits, minimum 2.
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padEnd(2, '0')}`;
  }

  public toNumber(): number {
    return this.time;
  }

  [Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
    if (hint === 'number' || hint === 'default') {
      return this.toNumber();
    }

    return this.toString();
  }

  public sub(other: Time | number) {
    if (other instanceof Time) other = other.time;
    this.add(-other);
  }

  public add(other: Time | number) {
    if (other instanceof Time) other = other.time;
    this.time += other;
  }
}
