import { expect, test } from '@playwright/test';

test('home page has logo image', async ({ page }) => {
	await page.goto('/');

	const logo = page.getByRole('img', { name: 'Logoi' });
	await expect(logo).toBeVisible();
});
