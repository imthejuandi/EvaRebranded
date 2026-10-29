"""Record genuine EVA dashboard interactions in a fresh demo browser.

No app UI, labels or fixture values are repainted. Only the review overlay is
hidden. The recorded camera includes the actual selected-result panel.
"""
import argparse
import asyncio
import json
import base64
import time
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/workspace/eva-light-dashboard-capture')

async def main(args):
    OUT.mkdir(parents=True,exist_ok=True)
    frames_dir=OUT/'frames';frames_dir.mkdir(exist_ok=True)
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        context=await browser.new_context(viewport={'width':1600,'height':1500},device_scale_factor=1,reduced_motion='no-preference')
        page=await context.new_page()
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        await page.goto(args.origin+'/es/dashboard',wait_until='domcontentloaded')
        await page.get_by_role('heading',name='Hola, Alex.').wait_for()
        await page.evaluate('document.fonts.ready')
        await page.add_style_tag(content='.content-review-dock{display:none!important}')
        await page.locator('#dashboard-signature').evaluate('e=>e.scrollIntoView({block:"start",behavior:"instant"})')
        await page.locator('canvas.score-orb-ring[data-settled="true"]').wait_for()
        await page.wait_for_timeout(300)
        base=await page.locator('#dashboard-signature').bounding_box()
        session=await context.new_cdp_session(page)
        frames=[]
        async def frame(event):
            index=len(frames);filename=frames_dir/f'{index:05}.png'
            filename.write_bytes(base64.b64decode(event['data']))
            frames.append({'file':str(filename),'timestamp':event['metadata']['timestamp']})
            await session.send('Page.screencastFrameAck',{'sessionId':event['sessionId']})
        session.on('Page.screencastFrame',frame)
        await session.send('Page.startScreencast',{'format':'png','everyNthFrame':1,'maxWidth':1600,'maxHeight':1500})
        started=time.monotonic();epoch=time.time()
        events=[]
        async def mark(name):events.append({'state':name,'time':round(time.monotonic()-started,3)})
        await mark('overview')
        await page.wait_for_timeout(1600)
        await page.locator('.score-orb-node[data-marker="apob"]').click()
        await page.locator('.score-orb-result:not([hidden])').wait_for()
        await mark('apob')
        apob=await page.locator('.score-orb-result').inner_text()
        detail=await page.locator('.score-orb-result').bounding_box()
        await page.screenshot(path=str(OUT/'apob-full.png'))
        await page.wait_for_timeout(2000)
        await page.locator('.score-orb-node[data-marker="hscrp"]').click()
        await mark('hscrp')
        hscrp=await page.locator('.score-orb-result').inner_text()
        await page.screenshot(path=str(OUT/'hscrp-full.png'))
        await page.wait_for_timeout(2000)
        await page.locator('.score-orb-result button[aria-label="Cerrar resultado"]').click()
        await page.mouse.move(20,20)
        await mark('overview-return')
        await page.wait_for_timeout(1800)
        duration=time.monotonic()-started
        await page.screenshot(path=str(OUT/'overview-full.png'))
        await session.send('Page.stopScreencast')
        await page.wait_for_timeout(100)
        await context.close()
        metadata={'source':'Actual /es/dashboard lossless PNG browser screencast, fresh default fictional demo context','captureEpoch':epoch,'frames':frames,'duration':round(duration,3),'signature':base,'result':detail,'events':events,'selectedResults':{'apob':apob,'hscrp':hscrp},'viewport':{'width':1600,'height':1500},'errors':errors}
        (OUT/'capture.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
        print(json.dumps({k:v for k,v in metadata.items() if k!='frames'},ensure_ascii=False),flush=True)
        await browser.close()

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--origin',default='http://127.0.0.1:4175');asyncio.run(main(parser.parse_args()))
