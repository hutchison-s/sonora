import { test, expect } from '@playwright/test';
import catalog from '../../content/grammar/lessons.json';

const headings = ['The Big Idea', 'Build It', 'See It Work', 'Spot the Difference', 'A Closer Look', 'Watch Your Step', 'Make It Yours', 'Take It With You'];

test('reads an expanded lesson, explores a note, reveals practice and plays existing audio', async ({ page }) => {
 await page.goto('/grammar/questions');
 for (const name of headings) await expect(page.getByRole('heading', { name, exact: true })).toBeVisible();
 const practice = page.locator('.grammar-practice').first();
 await expect(practice.locator('.grammar-answer')).not.toBeVisible();
 await practice.getByText('Reveal answer', { exact: true }).click();
 await expect(practice.locator('.grammar-answer')).toHaveText('¿Tienes un perro?');
 await expect(practice.locator('.grammar-answer')).toBeVisible();
 const note = page.locator('#closer-look details').first();
 await expect(note.locator('p')).not.toBeVisible();
 await note.locator('summary').click();
 await expect(note.locator('p')).toBeVisible();
 await expect(page.getByRole('button', { name: /^Play Spanish sentence:/ })).toHaveCount(4);
 await expect(page.locator('.grammar-text-example')).toHaveCount(0);
 const audioRequest = page.waitForResponse(response => response.url().endsWith('/audio/grammar/questions/01.mp3'));
 await page.getByRole('button', { name: 'Play Spanish sentence: ¿Dónde vives?', exact: true }).click();
 expect((await audioRequest).ok()).toBe(true);
 await expect(page.getByText('This recording couldn’t play. Please try again.')).not.toBeVisible();
 await page.getByRole('navigation', { name: 'In this lesson' }).getByRole('link', { name: 'Make It Yours' }).click();
 await expect(page).toHaveURL(/#make-it-yours$/);
 await expect(page.locator('#make-it-yours')).toBeInViewport();
});

test('every published lesson renders without missing sections or horizontal overflow', async ({ page }) => {
 for (const lesson of catalog.lessons) {
  const response = await page.goto(`/grammar/${lesson.id}`);
  expect(response?.status(), lesson.id).toBe(200);
  await expect(page.getByRole('heading', { name: /[.!?]$/.test(lesson.title) ? lesson.title : lesson.title + '.', exact: true })).toBeVisible();
  for (const name of headings) await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), lesson.id).toBe(true);
 }
});
