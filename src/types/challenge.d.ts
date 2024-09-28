declare namespace LRC {
  export type Challenge = {
    prefix: string;
    target: string;
  };

  export type SolvedChallenge = {
    prefix: string;
    nonce: number;
  };
}
