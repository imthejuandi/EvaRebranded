"""Exercise the exported review site in Chromium; writes review evidence."""
import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path('/workspace/eva-review-browser')
OUT.mkdir(exist_ok=True)
ORIGIN = 'http://127.0.0.1:4175'

async def main():
    results, errors, writes = [], [], []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-dev-shm-usage'])
        for width in [1440, 390]:
            context = await browser.new_context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
            page = await context.new_page()
            page.set_default_timeout(12000)
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('request', lambda request: writes.append(request.url) if request.method not in ['GET', 'HEAD'] else None)
            for route in ['/en', '/en/how-it-works', '/en/science', '/en/pricing', '/en/about', '/en/blog', '/en/contact', '/en/review', '/en/metodologia/completa', '/en/legal/privacy', '/en/signup', '/es/science']:
                response = await page.goto(ORIGIN + route, wait_until='domcontentloaded')
                await page.wait_for_timeout(600)
                data = await page.evaluate('''() => ({title: document.title, h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth > innerWidth + 2, lang: document.documentElement.lang, chapters: document.querySelectorAll('.restored-chapter').length})''')
                data.update(route=route, width=width, status=response.status)
                results.append(data)
                print(json.dumps(data), flush=True)
                (OUT / 'browser-progress.json').write_text(json.dumps(results, indent=2))
                if route in ['/en/science', '/en/about', '/en/pricing']:
                    chapter = page.locator('.restored-chapter').first
                    await chapter.scroll_into_view_if_needed()
                    await chapter.screenshot(path=str(OUT / f'{width}-{route.rsplit("/", 1)[-1]}-restored.png'))
                if route in ['/en/review', '/en/signup', '/en/legal/privacy']:
                    await page.screenshot(path=str(OUT / f'{width}-{route.rsplit("/", 1)[-1]}.png'))
            await page.goto(ORIGIN + '/en/signup', wait_until='domcontentloaded')
            checks = await page.locator('input[type="checkbox"]').evaluate_all('(els) => els.map(e => ({required:e.required, label:e.closest("label").textContent}))')
            results.append({'width': width, 'signupCheckboxes': checks})
            await page.goto(ORIGIN + '/en/review', wait_until='domcontentloaded')
            await page.get_by_text('Panel scope', exact=True).click()
            assert await page.locator('details').first.get_attribute('open') is not None
            await page.goto(ORIGIN + '/en/legal/privacy', wait_until='domcontentloaded')
            if width < 800:
                await page.locator('.eva-document-mobile-index summary').click()
                internal = page.locator('.eva-document-mobile-index nav a')
            else:
                internal = page.locator('.eva-document-desktop-index nav a')
            anchor_count = await internal.count()
            if anchor_count:
                href = await internal.first.get_attribute('href')
                await internal.first.click()
                assert await page.locator(href).count() > 0
            results.append({'width': width, 'privacyTocLinks': anchor_count})
            await context.close()
        await browser.close()
    report = {'pages': results, 'pageErrors': sorted(set(errors)), 'networkWrites': writes}
    (OUT / 'browser-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({'pageChecks':len([r for r in results if 'status' in r]), 'badStatuses':[r for r in results if r.get('status',200)!=200], 'overflow':[r for r in results if r.get('overflow')], 'pageErrors': sorted(set(errors)), 'networkWrites': writes}, ensure_ascii=False))

asyncio.run(main())
