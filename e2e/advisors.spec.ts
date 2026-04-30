import { expect, test } from '@playwright/test';

const listingsPayload = {
  data: Array.from({ length: 16 }).map((_, index) => {
    const id = index + 1;
    return {
      id,
      name: `Advisor ${id}`,
      profilePictureUrl: `https://example.com/avatar-${id}.jpg`,
      price: `$${id}.99/min`,
      'call-availability': id % 2 === 0 ? 0 : 1,
      'chat-availability': id % 3 === 0 ? 0 : 1,
    };
  }),
};

test.beforeEach(async ({ page }) => {
  await page.route('**/listings', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(listingsPayload),
    });
  });

  await page.route('**/advisor-availability?advisorId=*', async (route) => {
    const url = new URL(route.request().url());
    const advisorId = Number(url.searchParams.get('advisorId') ?? 0);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        advisorId,
        callAvailable: advisorId % 2 !== 0,
        chatAvailable: advisorId % 3 !== 0,
      }),
    });
  });
});

test('listings page loads and cards are visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /advisor listings/i })).toBeVisible();
  await expect(page.getByLabel('Advisor listings')).toBeVisible();
  await expect(page.getByLabel('Advisor listings').locator('article')).toHaveCount(10);
});

test('buttons display correct enabled and disabled behavior', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /call now/i }).first()).toBeEnabled();
  await expect(page.getByRole('button', { name: /call later/i }).first()).toBeDisabled();
  await expect(page.getByRole('button', { name: /chat now/i }).first()).toBeEnabled();
  await expect(page.getByRole('button', { name: /chat later/i }).first()).toBeDisabled();
});

test('pagination works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Advisor Laura', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Go to page 2' }).click();
  await expect(page.getByRole('heading', { name: 'Maya Quinn', exact: true })).toBeVisible();
});

test('switches to infinite scroll mode', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /infinite scroll/i }).click();
  const virtualList = page.getByLabel(/virtualized advisor listings/i);
  await expect(virtualList).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Victor Reed', exact: true })).toBeHidden();
  await virtualList.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  await expect(page.getByRole('heading', { name: 'Victor Reed', exact: true })).toBeVisible();
});

test('mobile viewport works', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'This test only applies to mobile project');

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /advisor listings/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /pagination/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /infinite scroll/i })).toBeVisible();
});
