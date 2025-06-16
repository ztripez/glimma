import { test, expect } from '@playwright/test';
import path from 'path';

const fileUrl = 'file://' + path.resolve('docs/_site/assets/examples/06-rotate.svg');

test('wheel rotates during animation', async ({ page }) => {
  await page.goto(fileUrl);
  const wheel = page.locator('#wheel');
  await page.waitForTimeout(1500);
  const transform = await wheel.evaluate(el => getComputedStyle(el).transform);
  expect(transform).not.toBe('none');
  expect(transform).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
});
