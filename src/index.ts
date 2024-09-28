import { run } from '@/cli';
import { exit } from 'node:process';

Arguments.Reader.initialize(() => {
  try {
    run().then((code) => exit(code));
  } catch {
    exit(1);
  }
});
