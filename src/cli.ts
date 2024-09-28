import { solve } from './solver';
import { load } from './loader';
import { Config } from 'config';
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

export async function run(): Promise<number> {
  console.log(c.bold('LRCLIBUploader'));
  if (Arguments.Reader.args.dryRun) prettyLog('--DRY RUN--');
  prettyLog(`Version: ${c.blue(Constants.VERSION.toString())}`);
  await checkForUpdates();
  const config: Utils.Result<Config> = load();
  if (!config.success || !config.result) {
    prettyError('Problem loading config. Aborting.');
    return 1;
  }

  if (Arguments.Reader.args.dryRun) {
    prettyLog('--DRY RUN END--');
    prettyLog('What would have been sent:');
    prettyLog('---PLAIN---');
    prettyLog(config.result?.plainLyrics.toString());
    prettyLog('---SYNCED---');
    prettyLog(config.result?.syncedLyrics.toString());

    return 0;
  }

  prettyLog('Requesting challenge.');
  const challenge: LRC.Challenge = (await (
    await fetch('https://lrclib.net/api/request-challenge', { method: 'POST' })
  ).json()) as LRC.Challenge;

  if (!challenge.prefix || !challenge.target) {
    console.error('Server gave us an invalid prefix or target.');
    return 1;
  }

  const solvedChallenge: LRC.SolvedChallenge = solve(
    challenge.prefix,
    challenge.target,
  );

  prettyLog(`Solved challenge! Nonce: ${solvedChallenge.nonce}`, true);

  const challengeResult: string = `${solvedChallenge.prefix}:${solvedChallenge.nonce}`;

  const stringBody: string = JSON.stringify({
    trackName: config.result?.data.trackName,
    artistName: config.result?.data.artistName,
    albumName: config.result?.data.albumName ?? 'null',
    duration: config.result?.data.duration,
    plainLyrics: config.result?.plainLyrics.toString(),
    syncedLyrics: config.result?.syncedLyrics.toString(),
  } as LRC.Requests.Publish);

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
      console.log(JSON.parse(text) as LRC.Responses.Publish);
    } catch {
      console.log(text);
    }

    return 1;
  }

  return 0;
}
