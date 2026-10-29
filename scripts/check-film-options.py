"""Browser acceptance for original + three real Tasso film directions.

Root runs through the approved npm entry point against the fresh export.
Visual realism is judged separately from the recorded temporal frames.
"""
import argparse
import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
IDS=['original','studio','morning','light']
CASES=[('en-desktop','en',1440,900,False),('en-phone','en',390,844,False),('es-phone','es',390,844,False),('en-reduced','en',390,844,True)]

async def playing(page, option):
    await page.wait_for_function('''id=>{
      const v=document.querySelector(`[data-film-option="${id}"] video`);
      return v && !v.paused && v.readyState>=2 && v.currentTime>.1;
    }''',arg=option)

async def paused(page, option):
    await page.wait_for_function('''id=>document.querySelector(`[data-film-option="${id}"] video`)?.paused===true''',arg=option)

async def select(page, option, index):
    panel=page.locator(f'[data-film-option="{option}"]')
    await panel.locator('.tasso-film-scene-selector button').nth(index).click()
    await page.wait_for_function('''({id,index})=>document.querySelectorAll(`[data-film-option="${id}"] .tasso-film-scene-selector button`)[index]?.getAttribute('aria-pressed')==='true' ''',arg={'id':option,'index':index})
    await paused(page,option)

async def run_case(browser, case, args, manifest, out):
    name,locale,width,height,reduced=case
    report={'case':name,'locale':locale,'width':width,'height':height,'reducedMotion':reduced,'issues':[],'sceneChecks':[]}
    context=await browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce' if reduced else 'no-preference')
    page=await context.new_page()
    page.set_default_timeout(18000)
    page.on('pageerror',lambda error:report['issues'].append('Page error: '+str(error)))
    try:
        response=await page.goto(args.origin.rstrip('/')+f'/{locale}/review/tasso-options',wait_until='domcontentloaded')
        assert response.status==200,'Comparison page status '+str(response.status)
        await page.locator('[data-tasso-film-comparison]').wait_for()
        await page.evaluate('document.fonts.ready')
        assert await page.locator('[data-film-option]').count()==4,'Expected original and three new directions'
        assert await page.locator('.tasso-film-availability.is-ready').count()==4,'Every complete film must be ready'
        await page.wait_for_timeout(350)
        initial=await page.locator('video[data-tasso-film-video]').evaluate_all('(videos)=>videos.map(v=>({paused:v.paused,autoplay:v.autoplay,time:v.currentTime}))')
        assert len(initial)==4 and all(v['paused'] and not v['autoplay'] for v in initial),'Unexpected initial autoplay'
        report['initialPlayback']=initial

        for option in IDS:
            panel=page.locator(f'[data-film-option="{option}"]')
            video=panel.locator('video[data-tasso-film-video]')
            for index in range(3):
                await select(page,option,index)
                expected=manifest[option]['scenes'][index]
                source=await video.get_attribute('src')
                poster=await video.get_attribute('poster')
                assert source==expected['video'],f'{option} scene {index+1} uses wrong video'
                assert poster==expected['poster'],f'{option} scene {index+1} uses wrong poster'
                selected=await panel.locator('.tasso-film-scene-selector button').evaluate_all('(buttons)=>buttons.map(b=>b.getAttribute("aria-pressed"))')
                assert selected.count('true')==1 and selected[index]=='true','Ambiguous scene selection'
                caption=await panel.locator('.tasso-film-caption').inner_text()
                if index==2:
                    low=caption.lower()
                    assert '2 ' in low and ('laborator' in low),'Results timing must retain lab-receipt qualification'
                assert not await panel.locator('.tasso-film-play').is_disabled(),'Ready media has disabled playback'
                report['sceneChecks'].append({'option':option,'scene':index+1,'video':source,'caption':caption})
            await select(page,option,0)
            await panel.locator('.tasso-film-screen').screenshot(path=str(out/f'{name}-{option}.png'))

        studio=page.locator('[data-film-option="studio"]')
        morning=page.locator('[data-film-option="morning"]')
        await studio.locator('.tasso-film-play').click()
        await playing(page,'studio')
        await studio.locator('.tasso-film-play').click()
        await paused(page,'studio')
        report['manualPlayPause']=True

        await studio.locator('.tasso-film-play').click()
        await playing(page,'studio')
        await morning.locator('.tasso-film-play').click()
        await playing(page,'morning')
        await paused(page,'studio')
        await morning.locator('.tasso-film-play').click()
        await paused(page,'morning')
        report['crossOptionPause']=True

        # One complete, normally timed three-clip sequence verifies real ended
        # events/source handoffs, rather than simulating the playlist logic.
        if name=='en-desktop':
            await select(page,'studio',0)
            await studio.locator('.tasso-film-play').click()
            await playing(page,'studio')
            for index in [1,2]:
                await page.wait_for_function('''index=>document.querySelectorAll('[data-film-option="studio"] .tasso-film-scene-selector button')[index]?.getAttribute('aria-pressed')==='true' ''',arg=index)
                await playing(page,'studio')
            await page.wait_for_function('''()=>{
              const section=document.querySelector('[data-film-option="studio"]'),v=section.querySelector('video');
              return v.paused&&section.querySelector('.tasso-film-play').textContent.includes('Play again');
            }''')
            report['fullSequenceAutoAdvance']=True

        assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+2'),'Horizontal document overflow'
        assert await page.locator('.tasso-film-error').count()==0,'Film error UI appeared'
        report['noOverflow']=True
    except Exception as error:
        report['issues'].append(type(error).__name__+': '+str(error))
        await page.screenshot(path=str(out/f'{name}-failure.png'))
    finally:
        await context.close()
    report['passed']=not report['issues']
    print(json.dumps({'case':name,'passed':report['passed'],'issues':report['issues']},ensure_ascii=False),flush=True)
    return report

async def main(args):
    data=json.loads((ROOT/'lib/site-content/tasso-film-options.json').read_text())
    manifest={item['id']:item for item in data['options']}
    assert set(manifest)==set(IDS),'Manifest must contain original and three new directions'
    for option in IDS:
        scenes=manifest[option]['scenes']
        assert len(scenes)==3 and all(s['ready'] and s['video'] and s['poster'] for s in scenes),f'{option} is incomplete'
        for scene in scenes:
            assert (ROOT/'public'/scene['video'].lstrip('/')).is_file(),'Missing local film '+scene['video']
            assert (ROOT/'public'/scene['poster'].lstrip('/')).is_file(),'Missing local poster '+scene['poster']
    out=Path(args.out)/f'loop-{args.loop}'
    out.mkdir(parents=True,exist_ok=True)
    reports=[]
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        for case in CASES:
            if args.case and case[0] not in args.case:
                continue
            reports.append(await run_case(browser,case,args,manifest,out))
            (out/'browser-report.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2))
        await browser.close()
    if any(not r['passed'] for r in reports):
        raise SystemExit(1)

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--origin',default='http://127.0.0.1:4175')
    parser.add_argument('--out',default='/workspace/eva-film-page-review')
    parser.add_argument('--loop',type=int,choices=[1,2,3],default=1)
    parser.add_argument('--case',action='append',choices=[case[0] for case in CASES])
    asyncio.run(main(parser.parse_args()))
