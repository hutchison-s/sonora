import { test, expect } from '@playwright/test';

test('filter, read, toggle English, explore and save a phrase, return later', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'The library.'})).toBeVisible();
  await page.getByRole('button',{name:'A1', exact:true}).click();
  await expect(page.locator('.feature-hero')).toBeVisible();
  await page.getByRole('link',{name:/Read La llave azul/}).click();
  await expect(page.getByRole('heading',{name:'La llave azul'})).toBeVisible();
  const toggle=page.getByRole('switch',{name:'Show English translations'});
  await toggle.click();
  await expect(toggle).toHaveAttribute('data-state','checked');
  await expect(page.locator('.sentence-english').first()).toBeVisible();
  const phrase=page.locator('.annotated-phrase').first();
  await phrase.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button',{name:'Save phrase'}).click();
  await expect(page.getByRole('button',{name:'Saved to phrases'})).toBeVisible();
  await page.getByRole('button',{name:'Close phrase explanation'}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole('switch',{name:'Show English translations'})).toHaveAttribute('data-state','checked');
  await page.goto('/profile');
  await page.getByRole('link',{name:/Your saved phrases/}).click();
  await expect(page.locator('.saved-item')).toHaveCount(1);
});

test('text-only edition makes unavailable audio unmistakable', async ({ page }) => {
  await page.goto('/stories/el-ultimo-cafe');
  await expect(page.getByRole('button',{name:/Listen — narration coming soon/})).toBeDisabled();
  await expect(page.getByText('Text edition')).toBeVisible();
  await expect(page.getByRole('heading',{name:'How much did you understand?'})).toBeVisible();
  await page.getByRole('button',{name:'Skip questions and finish'}).click();
  await expect(page.getByText(/Another story, well read/)).toBeVisible();
  await page.goto('/profile');
  await expect(page.getByText('Stories completed')).toBeVisible();
});
