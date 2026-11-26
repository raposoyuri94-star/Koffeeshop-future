import { test, expect } from '@playwright/test';

for (const width of [320, 1366]) {
  test(`gallery photos align and open at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./galeria.html');
    const gallery = page.getByRole('region', { name: 'Galeria', exact: true });
    await expect(gallery.getByRole('button')).toHaveCount(6);
    for (const photo of await gallery.locator('img').all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    const widths = await gallery.locator('button').evaluateAll(buttons => buttons.map(button => Math.round(button.getBoundingClientRect().width)));
    expect(new Set(widths).size).toBe(1);
    const heights = await gallery.locator('button').evaluateAll(buttons => buttons.map(button => Math.round(button.getBoundingClientRect().height)));
    expect(new Set(heights).size).toBe(1);
    const trigger = gallery.getByRole('button', { name: 'Ver foto: Café gelado', exact: true });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Café gelado', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`gallery page navigation and refresh work at ${width}px`, async ({ page, baseURL }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.locator('#gallery')).toHaveCount(0);
    await page.locator('.site-footer').getByRole('link', { name: 'Galeria', exact: true }).click();
    await expect(page).toHaveURL(new URL('galeria.html', baseURL).href);
    await page.reload();
    await expect(page).toHaveTitle('Galeria | Kofeeshop');
    await expect(page.getByRole('heading', { level: 1, name: 'Galeria', exact: true })).toBeVisible();
    await expect(page.locator('#menu, #story, #location')).toHaveCount(0);
    const broken = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
    expect(broken).toEqual([]);
    await page.getByRole('link', { name: 'Voltar à página inicial', exact: true }).click();
    await expect(page).toHaveURL(new URL('#home', baseURL).href);
    await expect(page.locator('#home')).toBeVisible();
    await page.goto('./galeria.html');
    if (width <= 900) await page.locator('.mobile-toggle').click();
    await page.locator('#main-navigation').getByRole('link', { name: 'Ver o menu', exact: true }).click();
    await expect(page).toHaveURL(new URL('#menu', baseURL).href);
    await expect(page.locator('#menu')).toBeVisible();
    expect(errors).toEqual([]);
  });
}
