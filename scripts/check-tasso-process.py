"""Browser acceptance checks for the Tasso scroll story (not a unit-test mirror).

Run against a built local export: python scripts/check-tasso-process.py --loop 1
Use --case to repeat only a failed viewport. Screenshots require human review.
"""
import argparse
import asyncio
import json
import subprocess
from pathlib import Path
from playwright.async_api import async_playwright

CASES = [
    ('en-desktop', 'en', 1440, 900, False),
    ('en-laptop', 'en', 1024, 768, False),
    ('en-phone', 'en', 390, 844, False),
    ('en-compact', 'en', 320, 640, False),
    ('es-desktop', 'es', 1440, 900, False),
    ('es-phone', 'es', 390, 844, False),
    ('es-compact', 'es', 320, 640, False),
    ('en-reduced', 'en', 1440, 900, True),
    ('es-reduced', 'es', 390, 844, True),
]

SNAPSHOT = '''() => {
 const root=document.querySelector('[data-tasso-process]');
 const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
 const opacity=e=>{let a=1;for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden')return 0;a*=Number(s.opacity)}return a};
 const visible=e=>{const r=e.getBoundingClientRect();return opacity(e)>.85&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth};
 const texts=e=>[...e.querySelectorAll('h1,h2,h3,p,figcaption,.tasso-report-row>span,.tasso-report-heading>span,.tasso-report-note')].filter(visible).map(n=>({text:n.textContent.trim(),rect:rect(n),fontSize:parseFloat(getComputedStyle(n).fontSize)})).filter(n=>n.text);
 const panels=[...root.querySelectorAll('[data-tasso-step]')].map(p=>({step:p.dataset.tassoStep,opacity:opacity(p),rect:rect(p),text:p.textContent.trim(),textBounds:texts(p)}));
 const report=root.querySelector('.tasso-report-object'),header=root.querySelector('.tasso-process-header'),reportCopy=root.querySelector('[data-tasso-step="3"] .tasso-process-copy');
 const reportLayout={opacity:opacity(report),art:rect(report),header:rect(header),copy:rect(reportCopy)};
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node,words=[];
 while(node=walker.nextNode()){const p=node.parentElement;if(node.textContent.trim()&&visible(p))words.push(node.textContent.trim())}
 return {frame:Number(document.querySelector('[data-rendered-frame]')?.dataset.renderedFrame),active:root.dataset.tassoActiveStep,panels,reportLayout,headingBounds:texts(root.querySelector('.tasso-process-header')),visibleText:words.join(' '),images:[...root.querySelectorAll('img')].filter(visible).map(i=>({src:i.getAttribute('src'),alt:i.alt,complete:i.complete&&i.naturalWidth>0,rect:rect(i)})),overflow:document.documentElement.scrollWidth>innerWidth+2};
}'''

async def seek(page, frame):
    await page.evaluate('''frame=>{
      const journey=document.querySelector('.scroll-journey'),stage=document.querySelector('.stage');
      const y=journey.getBoundingClientRect().top+scrollY+(journey.offsetHeight-stage.clientHeight)*frame/980;
      scrollTo({top:y,behavior:'instant'});
    }''', frame)
    await page.wait_for_function('''frame=>Math.abs(Number(document.querySelector('[data-rendered-frame]')?.dataset.renderedFrame)-frame)<1.5''', arg=frame)
    await page.wait_for_timeout(180)

def bounds_issues(snapshot, width, height):
    issues=[]
    if snapshot['overflow']:
        issues.append('Horizontal document overflow')
    report=snapshot.get('reportLayout',{})
    if report.get('opacity',0)>.85:
        a=report['art']
        for target in ['header','copy']:
            b=report[target]
            if min(a['right'],b['right'])-max(a['x'],b['x'])>3 and min(a['bottom'],b['bottom'])-max(a['y'],b['y'])>3:
                issues.append('Report artwork overlaps '+target)
    for panel in snapshot['panels']:
        if panel['opacity'] < .85:
            continue
        for item in panel['textBounds']:
            r=item['rect']
            if r['x'] < -2 or r['right'] > width+2 or r['y'] < -2 or r['bottom'] > height+2:
                issues.append('Visible step text leaves viewport: '+item['text'][:100])
        # Captions and step copy must not occupy the same reading area. This
        # catches crowded phone compositions even when neither leaves screen.
        text_items=panel['textBounds']+snapshot.get('headingBounds',[])
        for index, item in enumerate(text_items):
            a=item['rect']
            for other in text_items[index+1:]:
                b=other['rect']
                overlap_x=min(a['right'],b['right'])-max(a['x'],b['x'])
                overlap_y=min(a['bottom'],b['bottom'])-max(a['y'],b['y'])
                if overlap_x>3 and overlap_y>3:
                    issues.append('Visible text overlaps: '+item['text'][:55]+' / '+other['text'][:55])
    for image in snapshot['images']:
        if not image['complete']:
            issues.append('Visible image did not load: '+str(image['src']))
    return issues

async def run_case(browser, case, args, out):
    name,locale,width,height,reduced=case
    report={'case':name,'locale':locale,'width':width,'height':height,'reducedMotion':reduced,'issues':[],'frames':[]}
    context=await browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce' if reduced else 'no-preference')
    page=await context.new_page()
    page.set_default_timeout(18000)
    page.on('pageerror',lambda error:report['issues'].append('Page error: '+str(error)))
    try:
        response=await page.goto(args.origin.rstrip('/')+'/'+locale,wait_until='domcontentloaded')
        if response.status!=200:
            report['issues'].append('Page status '+str(response.status))
        await page.evaluate('document.fonts.ready')
        if reduced:
            summary=page.locator('[data-tasso-summary]')
            await summary.wait_for(state='visible')
            await summary.scroll_into_view_if_needed()
            await summary.locator('img').evaluate_all('(images)=>Promise.all(images.map(image=>image.decode().catch(()=>{})))')
            items=summary.locator('ol > li')
            report['summaryText']=await summary.inner_text()
            report['summarySteps']=await items.count()
            if report['summarySteps']!=3:
                report['issues'].append('Reduced-motion equivalent must expose an ordered list of three steps')
            for i in range(await items.count()):
                if not await items.nth(i).is_visible():
                    report['issues'].append('Reduced-motion step is hidden: '+str(i+1))
            report['motionSceneCount']=await page.locator('[data-tasso-process]').count()
            await page.screenshot(path=str(out/(name+'.png')),full_page=False)
        else:
            await page.locator('[data-tasso-process]').wait_for(state='attached')
            for frame,step in [(320,'1'),(345,'1'),(385,'2'),(440,'3')]:
                await seek(page,frame)
                snapshot=await page.evaluate(SNAPSHOT)
                snapshot['targetFrame']=frame
                report['frames'].append(snapshot)
                active=[p for p in snapshot['panels'] if p['opacity']>.85]
                if not any(p['step']==step for p in active):
                    report['issues'].append(f'Expected step {step} is not readable at frame {frame}')
                report['issues']+=bounds_issues(snapshot,width,height)
                await page.locator('.stage').screenshot(path=str(out/f'{name}-{frame}.png'))
            for frame in [419,404,365,350,320]:
                await seek(page,frame)
                snapshot=await page.evaluate(SNAPSHOT)
                report['issues']+=bounds_issues(snapshot,width,height)
                if frame==320:
                    first=report['frames'][0]
                    if snapshot['visibleText']!=first['visibleText']:
                        report['issues'].append('Reverse scroll changes settled step text at the same frame')
                else:
                    await page.locator('.stage').screenshot(path=str(out/f'{name}-reverse-{frame}.png'))
            # Inspect the neighboring scenes visually; no timing formula is copied here.
            for frame in [270,485]:
                await seek(page,frame)
                await page.locator('.stage').screenshot(path=str(out/f'{name}-handoff-{frame}.png'))
    except Exception as error:
        report['issues'].append(type(error).__name__+': '+str(error))
        await page.screenshot(path=str(out/(name+'-failure.png')))
    finally:
        await context.close()
    report['passed']=not report['issues']
    print(json.dumps({'case':name,'passed':report['passed'],'issues':report['issues']},ensure_ascii=False),flush=True)
    return report

async def preview(args):
    out=Path(args.out)/'preview'
    out.mkdir(parents=True,exist_ok=True)
    frames=[320,*range(354,363),385,*range(408,417),440]
    lines=[]
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        context=await browser.new_context(viewport={'width':1440,'height':900},reduced_motion='no-preference')
        page=await context.new_page()
        await page.goto(args.origin+'/en',wait_until='domcontentloaded')
        await page.locator('[data-tasso-process]').wait_for(state='attached')
        await page.evaluate('document.fonts.ready')
        for i,frame in enumerate(frames):
            await seek(page,frame)
            path=out/f'frame-{i:03}.png'
            await page.locator('.stage').screenshot(path=str(path))
            lines.extend([f"file '{path}'",f'duration {6 if frame in [320,385,440] else .12}'])
            if frame in [320,385,440]:
                print(f'Captured live animation step at frame {frame}',flush=True)
        lines.append(f"file '{path}'")
        await browser.close()
    sequence=out/'frames.txt'
    sequence.write_text('\n'.join(lines)+'\n')
    mp4=Path('/workspace/eva-tasso-preview.mp4')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(sequence),'-vf','fps=24','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(mp4)],check=True)
    gif=Path('/workspace/eva-tasso-preview.gif')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(mp4),'-filter_complex','fps=10,scale=840:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse','-loop','0',str(gif)],check=True)
    print(json.dumps({'preview':str(mp4),'gif':str(gif),'source':'actual Chromium-rendered scroll frames'}),flush=True)

async def main(args):
    if args.preview:
        await preview(args)
        return
    out=Path(args.out)/f'loop-{args.loop}'
    out.mkdir(parents=True,exist_ok=True)
    reports=[]
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        for case in CASES:
            if args.case and case[0] not in args.case:
                continue
            reports.append(await run_case(browser,case,args,out))
            (out/'browser-report.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2))
        await browser.close()
    if any(not r['passed'] for r in reports):
        raise SystemExit(1)

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--origin',default='http://127.0.0.1:4175')
    parser.add_argument('--out',default='/workspace/eva-tasso-review')
    parser.add_argument('--loop',type=int,choices=[1,2,3],default=1)
    parser.add_argument('--case',action='append',choices=[c[0] for c in CASES])
    parser.add_argument('--preview',action='store_true')
    asyncio.run(main(parser.parse_args()))
