
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(f"file:///app/index.html")

        # First, make the main application container visible
        await page.evaluate("() => { document.getElementById('app-container').style.display = 'block'; }")

        # Now, render the specific content section
        await page.evaluate("() => renderContent('flujo-caja')")

        # Wait for the section to be visible
        await page.wait_for_selector("#flujo-caja.active")

        await page.screenshot(path="screenshot.png")
        await browser.close()

asyncio.run(main())
