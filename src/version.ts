/**
 * This class helps make semantic versions.
 */
export class Version {
  /**
   * The major version number.
   */
  public major: number;

  /**
   * The minor version number.
   */
  public minor: number;

  /**
   * The hotfix version number.
   */
  public hotfix: number;

  constructor(major: number = 1, minor: number = 0, hotfix: number = 0) {
    if (major < 1 || minor < 0 || hotfix < 0) {
      throw new Error(
        'Out of bounds version.\nMake sure `major` is >= 1, and that `minor` and `hotfix` are >= 0',
      );
    }

    this.major = major;
    this.minor = minor;
    this.hotfix = hotfix;
  }

  /**
   * Checks if the current version is the same as another version.
   * @param other The version to compare with.
   * @param includeHotfix If true, hotfixes count into checking.
   * @returns {boolean}
   */
  public isSame(other: Version, includeHotfix: boolean = true): boolean {
    return (
      this.major == other.major &&
      this.minor == other.minor &&
      (includeHotfix ? true : this.hotfix === other.hotfix)
    );
  }

  /**
   * Checks whether the current version is older than another version.
   * Equivalent of `!this.isNewer(other, includeHotfix);`
   * @param other The version to compare with.
   * @param includeHotfix If true, hotfixes count into checking.
   * @returns {boolean}
   */
  public isOlder(other: Version, includeHotfix: boolean = true): boolean {
    return !this.isNewer(other, includeHotfix);
  }

  /**
   * Checks whether the current version is newer than another version.
   * @param other The version to compare with.
   * @param includeHotfix If true, hotfixes count into checking.
   * @returns {boolean}
   */
  public isNewer(other: Version, includeHotfix: boolean = true): boolean {
    if (this.major > other.major) return true;
    if (this.minor > other.minor && this.major == other.major) return true;
    if (
      includeHotfix &&
      this.major == other.major &&
      this.minor == other.minor &&
      this.hotfix > other.hotfix
    )
      return true;

    return false;
  }

  /**
   * Returns a semantic version.
   * @returns {string} Stringified version.
   */
  public toString(): string {
    return `${this.major}.${this.minor}.${this.hotfix}`;
  }

  public toObject(): object {
    return {
      major: this.major,
      minor: this.minor,
      hotfix: this.hotfix,
    };
  }
}
