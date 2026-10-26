import { test, expect } from '@playwright/test';

test('finds tilde coverage and reads a new text-only lesson without false audio controls', async ({ page }) => {
 await page.goto('/grammar');
 await page.getByRole('textbox', { name: 'Search grammar lessons' }).fill('tilde');
 await expect(page.getByRole('heading', { name: 'Read the Accent Mark', exact: true })).toBeVisible();
 await page.goto('/grammar/letter-combinations');
 await expect(page.getByRole('heading', { name: 'Read ll and ch together' })).toBeVisible();
 await expect(page.getByRole('button', { name: /^Play Spanish sentence:/ })).toHaveCount(0);
 await expect(page.locator('.grammar-text-example')).toHaveCount(4);
 const visual = page.getByRole('figure', { name: 'Read ll as one consonant spelling' });
 await visual.getByRole('button', { name: 'Show me how' }).click();
 await expect(visual.locator('.grammar-token-line')).toHaveText('llave');
 await visual.getByRole('button', { name: 'Next step' }).click();
 await expect(visual.locator('.grammar-token-line')).toHaveText('calle');
 await page.getByRole('navigation', { name: 'Related grammar lessons' }).getByRole('link', { name: /Getting to Know Spanish Letters/ }).click();
 await expect(page).toHaveURL(/\/grammar\/alphabet$/);
});

test('connects a story annotation to its rule and the lesson back to the source story', async ({ page }) => {
 await page.goto('/stories/la-mesa-para-dos');
 await page.getByRole('button', { name: 'Explain phrase: le ofrece', exact: true }).click();
 await page.getByRole('navigation', { name: 'Learn the grammar rule' }).getByRole('link', { name: /Who Receives It/ }).click();
 await expect(page).toHaveURL(/\/grammar\/indirect-objects$/);
 await expect(page.getByRole('heading', { name: 'Who Receives It?', exact: true })).toBeVisible();
 await expect(page.locator('.grammar-reading-links')).toContainText('Rosa le ofrece agua.');
 await page.locator('.grammar-reading-links').getByRole('link', { name: 'Read La mesa para dos →', exact: true }).click();
 await expect(page).toHaveURL(/\/stories\/la-mesa-para-dos$/);
});
