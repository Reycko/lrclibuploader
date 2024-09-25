import * as crypto from 'crypto';
import { SolvedChallenge } from 'challenge';
import { prettyLog } from './print';

export function verify_nonce(result: Uint8Array, target: Uint8Array): boolean {
  if (result.length != target.length) return false;

  for (let i: number = 0; i < result.length - 1; i++) {
    if (result[i] > target[i]) return false;
    else if (result[i] < target[i]) break;
  }

  return true;
}

export function solve(prefix: string, target_hex: string): SolvedChallenge {
  let nonce: number = 0;
  const target: Uint8Array = Buffer.from(target_hex, 'hex');

  console.log('');
  while (true) {
    if (nonce % 100000 === 0)
      prettyLog(`Solver - Nonce (~100000): ${nonce}`, true);
    const input = `${prefix}${nonce}`;
    const hashed = crypto.createHash('sha256').update(input).digest();
    if (verify_nonce(hashed, target)) {
      break;
    } else {
      nonce++;
    }
  }

  return { nonce: nonce, prefix: prefix };
}
