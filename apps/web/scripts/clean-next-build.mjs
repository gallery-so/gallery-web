import { rmSync } from 'node:fs';

rmSync(new URL('../.next', import.meta.url), { recursive: true, force: true });
