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

test('searches vocabulary and plays an exact span from the story recording', async ({ page }) => {
  await page.goto('/stories/el-ultimo-cafe/vocabulary');
  const search=page.getByRole('searchbox',{name:'Search vocabulary'});
  await search.fill('camarero');
  await expect(page.locator('.vocab-result-count')).toHaveText('1 result');
  const play=page.getByRole('button',{name:'Hear el camarero from the story recording'});
  await expect(play).toBeVisible();
  await play.click();
  await expect(page.getByRole('button',{name:'Stop el camarero from the story recording'})).toBeVisible();
  await search.fill('estas');
  await expect(page.getByRole('heading',{name:/Verbs/})).toBeVisible();
  await expect(page.getByText('estar',{exact:true})).toBeVisible();
});
