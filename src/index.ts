import * as Solver from './solver';
import { load } from './loader';
import { ConfigResult } from '+/config';
import { exit } from 'node:process';
import { Challenge, SolvedChallenge } from '+/challenge';
import { PublishRequest, PublishResponse } from '+/req';
import * as Constants from '@/consts';
import c from 'ansi-colors';
import { prettyLog, prettyError, prettyWarn } from './print';
import * as semver from 'semver';

async function checkForUpdates() {
  const res: Response = await fetch(
    'https://raw.githubusercontent.com/Reycko/lrclibuploader/master/package.json',
  );
  const json = await res.json();
  if (!json.version) {
    prettyWarn('Unable to check for updates.');
    return;
  }
  if (semver.gt(Constants.VERSION, json.version)) {
    prettyWarn(`Latest version is ${c.cyan(json.version)}`);
  }
}

async function main(dry: boolean): Promise<number> {
  console.log(c.bold('LRCLIBUploader'));
  if (dry) prettyLog('--DRY RUN--');
  prettyLog(`Version: ${c.blue(Constants.VERSION.toString())}`);
  await checkForUpdates();
  const config: ConfigResult = load();
  if (!config.success || !config.config) {
    prettyError('Problem loading config. Aborting.');
    return 1;
  }

  if (dry) {
    prettyLog('--DRY RUN END--');
    prettyLog('What would have been sent:');
    prettyLog('---PLAIN---');
    prettyLog(config.config?.plainLyrics.toString());
    prettyLog('---SYNCED---');
    prettyLog(config.config?.syncedLyrics.toString());

    return 0;
  }

  prettyLog('Requesting challenge.');
  const challenge: Challenge = (await (
    await fetch('https://lrclib.net/api/request-challenge', { method: 'POST' })
  ).json()) as Challenge;

  if (!challenge.prefix || !challenge.target) {
    console.error('Server gave us an invalid prefix or target.');
    return 1;
  }

  const solvedChallenge: SolvedChallenge = Solver.solve(
    challenge.prefix,
    challenge.target,
  );

  prettyLog(`Solved challenge! Nonce: ${solvedChallenge.nonce}`, true);

  const challengeResult: string = `${solvedChallenge.prefix}:${solvedChallenge.nonce}`;

  const stringBody: string = JSON.stringify({
    trackName: config.config?.data.trackName,
    artistName: config.config?.data.artistName,
    albumName: config.config?.data.albumName ?? 'null',
    duration: config.config?.data.duration,
    plainLyrics: config.config?.plainLyrics.toString(),
    syncedLyrics: config.config?.syncedLyrics.toString(),
  } as PublishRequest);

  const res: Response = await fetch('https://lrclib.net/api/publish', {
    method: 'POST',
    headers: {
      'X-Publish-Token': challengeResult,
      'Content-Type': 'application/json',
    },
    body: stringBody,
  });

  if (res.ok) {
    prettyLog('Uploaded!');
  } else {
    prettyError(
      `Non-OK response | Status code ${res.status} (${res.statusText}):`,
    );
    const text: string = await res.text();
    try {
      console.log(JSON.parse(text) as PublishResponse);
    } catch {
      console.log(text);
    }

    return 1;
  }

  return 0;
}

// init
try {
  // TODO: use some sort of dedicated argument parser to add proper cmdline args
  main(process.argv[process.argv.length - 1].toLowerCase() === 'dry').then(
    (r) => {
      exit(r);
    },
  );
} catch {
  exit(1);
}
