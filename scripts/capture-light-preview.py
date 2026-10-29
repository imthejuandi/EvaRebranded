"""Render the actual browser scroll choreography as a review movie."""
import argparse
import asyncio
import json
import subprocess
from pathlib import Path
from playwright.async_api import async_playwright

OUT=Path('/workspace/eva-light-cinematic-preview')

async def main(args):
    out=OUT/f'loop-{args.loop}'
    out.mkdir(parents=True,exist_ok=True)
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        for name,width,height in [('desktop',1440,900),('phone',390,844)]:
            folder=out/name;folder.mkdir(exist_ok=True)
            context=await browser.new_context(viewport={'width':width,'height':height},reduced_motion='no-preference')
            page=await context.new_page()
            await page.goto('http://127.0.0.1:4175/en/review/tasso-options#film-light',wait_until='domcontentloaded')
            await page.locator('[data-light-stage]').wait_for()
            await page.evaluate('document.fonts.ready')
            for index in range(121):
                progress=index/120
                await page.evaluate('''p=>{const e=document.querySelector('[data-light-cinematic]'),s=e.querySelector('[data-light-stage]');scrollTo({top:e.getBoundingClientRect().top+scrollY+(e.offsetHeight-s.offsetHeight)*p,behavior:'instant'})}''',progress)
                await page.wait_for_function('''p=>Math.abs(Number(document.querySelector('[data-light-cinematic]').dataset.lightProgress)-p)<.002''',arg=progress)
                await page.wait_for_function('''()=>{const h=document.querySelector('[data-light-cinematic]'),c=h.querySelector('[data-light-canvas]');return c.dataset.sourceScene===h.dataset.lightSourceScene&&c.dataset.renderedFrame&&c.dataset.renderedFrame!=='poster'}''')
                await page.locator('[data-light-stage]').screenshot(path=str(folder/f'{index:04}.jpg'),type='jpeg',quality=88)
            await context.close()
            movie=out/f'{name}.mp4'
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','10','-i',str(folder/'%04d.jpg'),'-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(movie)],check=True)
            print(json.dumps({'case':name,'movie':str(movie),'frames':121}),flush=True)
        await browser.close()

parser=argparse.ArgumentParser();parser.add_argument('--loop',type=int,choices=[1,2,3],default=1)
asyncio.run(main(parser.parse_args()))
