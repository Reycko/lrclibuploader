import * as crypto from 'crypto';
import { SolvedChallenge } from './types/challenge';

export class Solver {
  private static verify_nonce(result: Uint8Array, target: Uint8Array): boolean {
    if (result.length != target.length) return false;

    for (let i: number = 0; i < result.length - 1; i++) {
      if (result[i] > target[i]) return false;
      else if (result[i] < target[i]) break;
    }

    return true;
  }

  public static solve(prefix: string, target_hex: string): SolvedChallenge {
    let nonce: number = 0;
    const target: Uint8Array = Buffer.from(target_hex, 'hex');

    while (true) {
      const input = `${prefix}${nonce}`;
      if (
        this.verify_nonce(
          crypto.createHash('sha256').update(input).digest(),
          target,
        )
      )
        break;
      else {
        nonce++;
      }
    }

    return { nonce: nonce, prefix: prefix };
  }
}
