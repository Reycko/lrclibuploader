import * as Solver from './solver';
import { load } from './loader';
import { ConfigResult } from './types/config';
import { exit } from 'node:process';
import { Challenge, SolvedChallenge } from './types/challenge';
import { PublishRequest, PublishResponse } from './types/req';
import * as Constants from './consts';
import c from 'ansi-colors';
import { prettyLog, prettyError } from './print';

async function main(): Promise<number> {
  console.log(c.bold('LRCLIBUploader'));
  prettyLog(`Version: ${c.blue(Constants.VERSION.toString())}`);
  const config: ConfigResult = load();
  if (!config.success || !config.config) {
    prettyError('Problem loading config. Aborting.');
    return 1;
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
  prettyLog(`Solved challenge! Nonce: ${solvedChallenge.nonce}`);

  const challengeResult: string = `${solvedChallenge.prefix}:${solvedChallenge.nonce}`;

  const stringBody: string = JSON.stringify({
    trackName: config.config?.data.trackName,
    artistName: config.config?.data.artistName,
    albumName: config.config?.data.albumName ?? '',
    duration: config.config?.data.duration,
    plainLyrics: config.config?.plainLyrics,
    syncedLyrics: config.config?.syncedLyrics ?? '',
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

try {
  main().then((r) => {
    exit(r);
  });
} catch {
  exit(1);
}
