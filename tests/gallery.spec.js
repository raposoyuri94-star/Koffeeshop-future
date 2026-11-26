import { test, expect } from '@playwright/test';

for (const width of [320, 1366]) {
  test(`gallery photos align and open at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#gallery');
    const gallery = page.getByRole('region', { name: 'Galeria', exact: true });
    await expect(gallery.getByRole('button')).toHaveCount(6);
    for (const photo of await gallery.locator('img').all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    const widths = await gallery.locator('button').evaluateAll(buttons => buttons.map(button => Math.round(button.getBoundingClientRect().width)));
    expect(new Set(widths).size).toBe(1);
    const trigger = gallery.getByRole('button', { name: 'Ver foto: Café gelado', exact: true });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Café gelado', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
