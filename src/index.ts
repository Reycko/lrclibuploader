import Arguments from '@/classes/arguments';
import { run } from '@/cli';
import { exit } from 'node:process';

Arguments.initialize(() => {
  try {
    run().then((code) => exit(code));
  } catch {
    exit(1);
  }
});
