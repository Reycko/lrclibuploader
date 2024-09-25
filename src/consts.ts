import * as semver from 'semver';
import { version } from '@/../package.json';

/* Constants for stuff like version */

export const VERSION: semver.SemVer | string = semver.parse(version) ?? version;
