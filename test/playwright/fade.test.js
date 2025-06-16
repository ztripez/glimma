import { test, expect } from '@playwright/test';
import path from 'path';

const fileUrl = 'file://' + path.resolve('docs/_site/assets/examples/01-fade.svg');

test('box fades in over time', async ({ page }) => {
  await page.goto(fileUrl);
  const box = page.locator('#box');
  await page.waitForTimeout(2100);
  await expect(box).toHaveCSS('opacity', '1');
});
