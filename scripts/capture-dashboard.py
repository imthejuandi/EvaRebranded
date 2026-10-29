"""Capture the actual app in a fresh isolated demo browser context."""
import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

OUT=Path('/workspace/eva-dashboard-reference')
OUT.mkdir(exist_ok=True)

async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        context=await browser.new_context(viewport={'width':1600,'height':1100},device_scale_factor=1,reduced_motion='reduce')
        page=await context.new_page()
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        await page.goto('http://127.0.0.1:4175/es/dashboard',wait_until='domcontentloaded')
        await page.get_by_role('heading',name='Hola, Alex.').wait_for()
        await page.locator('#dashboard-signature').wait_for()
        await page.evaluate('document.fonts.ready')
        await page.wait_for_timeout(1200)
        await page.add_style_tag(content='.content-review-dock{display:none!important}')
        await page.screenshot(path=str(OUT/'dashboard-overview.png'))
        await page.locator('#dashboard-signature').screenshot(path=str(OUT/'dashboard-signature.png'))
        await page.locator('#dashboard-signature').evaluate('(element)=>element.scrollIntoView({block:"start",behavior:"instant"})')
        box=await page.locator('#dashboard-signature').bounding_box()
        target=Path('/workspace/eva-content-review/public/art/tasso-scroll/eva-dashboard.jpg')
        target.parent.mkdir(parents=True,exist_ok=True)
        await page.screenshot(path=str(target),type='jpeg',quality=94,clip={'x':box['x'],'y':max(0,box['y']),'width':box['width'],'height':780})
        report={'url':page.url,'viewport':{'width':1600,'height':1100},'source':'Actual /es/dashboard rendered from repository code','context':'Fresh browser; default ready demo fixture, no saved user data','heading':await page.locator('h1').inner_text(),'errors':errors}
        (OUT/'capture.json').write_text(json.dumps(report,indent=2))
        print(json.dumps(report),flush=True)
        await browser.close()

asyncio.run(main())
