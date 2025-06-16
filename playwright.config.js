import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: path.join('test', 'playwright'),
  use: {
    headless: true,
  },
});
