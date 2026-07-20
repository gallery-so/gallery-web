import { rmSync } from 'node:fs';

rmSync(new URL('../.open-next', import.meta.url), { recursive: true, force: true });
