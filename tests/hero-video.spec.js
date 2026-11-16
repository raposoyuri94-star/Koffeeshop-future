import { test, expect } from '@playwright/test';

for (const width of [390, 1366]) {
  test(`hero video plays silently and can pause and resume at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('./');

    const video = page.locator('.hero-video');
    await expect.poll(() => video.evaluate(element => (
      element.muted && !element.paused && element.currentTime > 0 && element.videoWidth > 0
    ))).toBe(true);

    await page.getByRole('button', { name: 'Pausar vídeo de fundo' }).click();
    await expect.poll(() => video.evaluate(element => element.paused)).toBe(true);
    await page.locator('.hero').screenshot({ path: test.info().outputPath('hero.png') });

    await page.getByRole('button', { name: 'Reproduzir vídeo de fundo' }).click();
    await expect.poll(() => video.evaluate(element => !element.paused)).toBe(true);
    await expect(page.getByRole('link', { name: 'Escolher o meu pedido' })).toBeVisible();
  });
}

test('reduced motion shows a still image without downloading the video and responds to preference changes', async ({ page }) => {
  const videoRequests = [];
  page.on('request', request => {
    if (request.url().includes('/videos/koffee-hero.mp4')) videoRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');

  const poster = page.locator('.hero-image');
  await expect.poll(() => poster.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.hero-video')).toHaveCount(0);
  expect(videoRequests).toEqual([]);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => page.locator('.hero-video').evaluate(video => !video.paused && video.currentTime > 0)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.hero-video')).toHaveCount(0);
  await expect(poster).toBeVisible();
});

test('an unavailable video leaves the hero image and menu link usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/videos/koffee-hero.mp4', route => route.abort());
  await page.goto('./');

  await expect(page.locator('.hero-video')).toHaveCount(0);
  await expect.poll(() => page.locator('.hero-image').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.getByRole('link', { name: 'Escolher o meu pedido' }).click();
  await expect(page).toHaveURL(/#menu$/);
  await expect(page.locator('#menu')).toBeVisible();
});
