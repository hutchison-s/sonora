import { test, expect } from '@playwright/test';

test('conjugation steps preserve the stem and change the chosen subject ending', async ({ page }) => {
 await page.goto('/grammar/present-ar');
 const visual = page.getByRole('figure', { name: 'Build the verb, one piece at a time' });
 await expect(visual.locator('.grammar-token-line')).toHaveText('hablo');
 await visual.getByRole('button', { name: 'Show me how' }).click();
 await expect(visual.locator('.grammar-token-line')).toHaveText('hablar');
 await expect(visual.getByRole('button', { name: 'Back', exact: true })).toBeDisabled();
 await visual.getByRole('button', { name: 'Next step' }).click();
 await expect(visual.locator('.grammar-token-line')).toHaveText('habl');
 await visual.getByRole('button', { name: 'Next step' }).click();
 await expect(visual.locator('.grammar-token-line')).toHaveText('hablo');
 await expect(visual.getByRole('button', { name: 'Next step' })).toBeDisabled();
 await visual.getByLabel('Example').selectOption({ label: 'tú' });
 await expect(visual.locator('.grammar-token-line')).toHaveText('hablas');
 await expect(visual.getByRole('button', { name: 'Show me how' })).toBeVisible();
});

test('question marks, reordered objects, stress and timelines have readable step results', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/grammar/questions');
 const question = page.getByRole('figure', { name: 'Frame the question' });
 await question.getByRole('button', { name: 'Show me how' }).click();
 await expect(question.locator('.grammar-token-line')).toHaveText('Hablas español.');
 await question.getByRole('button', { name: 'Next step' }).click();
 await expect(question.locator('.grammar-token-line')).toHaveText('¿Hablas español?');
 await page.goto('/grammar/object-pronouns');
 await expect(page.locator('.grammar-token-line')).toHaveText('Lo leo.');
 await page.goto('/grammar/stress');
 await expect(page.locator('.grammar-syllable-stressed')).toContainText('bló');
 await page.goto('/grammar/past-contrast');
 const timeline = page.locator('.grammar-visual');
 await timeline.getByRole('button', { name: 'Show me how' }).click();
 await expect(timeline.locator('.grammar-timeline-event')).toHaveCount(0);
 await timeline.getByRole('button', { name: 'Next step' }).click();
 await expect(timeline.locator('.grammar-timeline-event')).toHaveCount(1);
});

test('all visual types fit a narrow screen without horizontal overflow', async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 800 });
 for (const lesson of ['questions', 'present-ar', 'stress', 'past-contrast', 'hypotheticals']) {
  await page.goto(`/grammar/${lesson}`);
  await expect(page.locator('.grammar-visual')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), lesson).toBe(true);
 }
});
