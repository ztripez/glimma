import { test, expect } from '@playwright/test';
import path from 'path';

const fileUrl = 'file://' + path.resolve('docs/_site/assets/examples/07-scale.svg');

test('box scales up', async ({ page }) => {
  await page.goto(fileUrl);
  const box = page.locator('#box');
  await page.waitForTimeout(3100);
  const transform = await box.evaluate(el => getComputedStyle(el).transform);
  expect(transform).not.toBe('none');
});
