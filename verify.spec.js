const { test, expect } = require('@playwright/test');

test.describe('Date Range Closure Modal Verification', () => {
  test('should correctly open modals and display date range', async ({ page }) => {
    // 1. Navigate to the local verification file
    await page.goto('file://' + process.cwd() + '/verify.html', { waitUntil: 'networkidle' });

    // 2. Click the button to open the first modal
    await page.click('#open-modal-button');

    // 3. Verify the date range modal is visible
    const dateRangeModal = page.locator('#date-range-closure-modal');
    await expect(dateRangeModal).toBeVisible();
    await expect(dateRangeModal.locator('h2')).toHaveText('Seleccionar Período de Cierre');

    // 4. Enter start and end dates
    await page.fill('#closure-start-date', '2025-10-01');
    await page.fill('#closure-end-date', '2025-10-31');

    // Take screenshot of the first modal filled out
    await page.screenshot({ path: 'screenshot-1-date-range-modal.png' });

    // 5. Click the "Continue" button
    await page.click('#continue-closure-btn');

    // 6. Verify the first modal is hidden and the confirmation modal is visible
    await expect(dateRangeModal).toBeHidden();
    const confirmationModal = page.locator('#close-month-modal');
    await expect(confirmationModal).toBeVisible();

    // 7. Verify the confirmation modal contains the correct date range
    const periodDisplay = confirmationModal.locator('#close-period-display');
    await expect(periodDisplay).toHaveText('2025-10-01 to 2025-10-31');

    // Take a screenshot of the final confirmation modal
    await page.screenshot({ path: 'screenshot-2-confirmation-modal.png' });

    // 8. Close the confirmation modal
    await confirmationModal.locator('[data-close-modal="close-month-modal"]').click();
    await expect(confirmationModal).toBeHidden();
  });
});
