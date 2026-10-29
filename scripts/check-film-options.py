"""Acceptance for the three preserved scroll directions; root runs via npm.

Light has its own stricter check-light-cinematic.py acceptance.

Checks real canvas pixels, reverse/stopped scroll, the exact approved dashboard,
keyboard jumps and static reduced-motion equivalents. No player tests remain.
"""
import argparse
import asyncio
import hashlib
import json
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
IDS=['original','studio','morning']
CASES=[('en-desktop','en',1440,900,False),('es-desktop','es',1440,900,False),('en-phone','en',390,844,False),('es-phone','es',390,844,False),('es-compact','es',320,640,False),('en-reduced','en',390,844,True),('es-reduced','es',390,844,True)]

SNAPSHOT='''id=>{
 const root=document.querySelector(`[data-film-option="${id}"]`),stage=root.querySelector('[data-tasso-scroll-stage]');
 const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
 const alpha=e=>{let a=1;for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden')return 0;a*=Number(s.opacity)}return a};
 const pixel=c=>{if(c.dataset.renderedFrame===undefined)return null;const t=document.createElement('canvas');t.width=16;t.height=16;const x=t.getContext('2d',{willReadFrequently:true});x.drawImage(c,0,0,16,16);const d=x.getImageData(0,0,16,16).data;let h=2166136261,opaque=0;for(let i=0;i<d.length;i++){h=Math.imul(h^d[i],16777619);if(i%4===3&&d[i]>240)opaque++}return {hash:(h>>>0).toString(16),opaque}};
 const selected=root.querySelector('[data-tasso-scroll-caption][aria-hidden="false"]');
 const texts=selected?[...selected.querySelectorAll('h3,p,a,span')].filter(e=>alpha(e)>.05).map(e=>({text:e.textContent.trim(),rect:box(e)})).filter(e=>e.text):[];
 const dashboard=root.querySelector('[data-tasso-dashboard]');
 const layers=[...root.querySelectorAll('[data-tasso-scroll-layer]')].map(e=>{const c=e.querySelector('canvas'),p=e.querySelector('img');return {index:Number(e.dataset.tassoScrollLayer),opacity:Number(getComputedStyle(e).opacity),visibility:getComputedStyle(e).visibility,canvas:c?{frame:c.dataset.renderedFrame,scene:c.dataset.renderedScene,atlas:c.dataset.atlasSrc,width:c.width,height:c.height,pixels:pixel(c),opacity:Number(getComputedStyle(c).opacity)}:null,poster:p?{ready:p.complete&&p.naturalWidth>0,src:p.currentSrc}:null}});
 const comparison=document.querySelector('[data-tasso-film-comparison]');
 return {progress:Number(root.dataset.scrollProgress),step:Number(root.dataset.scrollStep),scrollY,stage:box(stage),layers,caption:selected?.textContent.trim(),texts,jumps:box(root.querySelector('[data-tasso-scroll-jumps],.tasso-scroll-jumps')),footer:box(root.querySelector('.tasso-scroll-option-footer')),dashboard:dashboard?{src:dashboard.currentSrc,ready:dashboard.complete&&dashboard.naturalWidth>0,width:dashboard.naturalWidth,height:dashboard.naturalHeight,opacity:alpha(dashboard)}:null,cacheCount:Number(comparison.dataset.atlasCacheCount||0),cacheBytes:Number(comparison.dataset.atlasCacheBytes||0),overflow:document.documentElement.scrollWidth>innerWidth+2};
}'''

async def seek(page, option, progress):
    await page.evaluate('''({id,p})=>{const e=document.querySelector(`[data-film-option="${id}"]`),s=e.querySelector('[data-tasso-scroll-stage]');scrollTo({top:e.getBoundingClientRect().top+scrollY+(e.offsetHeight-s.offsetHeight)*p,behavior:'instant'})}''',{'id':option,'p':progress})
    await page.wait_for_function('''({id,p})=>Math.abs(Number(document.querySelector(`[data-film-option="${id}"]`)?.dataset.scrollProgress)-p)<.003''',arg={'id':option,'p':progress})
    await page.wait_for_timeout(120)

async def frame_ready(page, option, scene):
    await page.wait_for_function('''({id,i})=>{
      const r=document.querySelector(`[data-film-option="${id}"]`),p=Number(r.dataset.scrollProgress),c=r.querySelector(`[data-sequence-index="${i}"]`);
      const t=i===0?p/.33:(p-.39)/.25,expected=Math.min(59,Math.max(0,t*60));
      return c&&c.dataset.renderedFrame!==undefined&&Math.abs(Number(c.dataset.renderedFrame)-expected)<1.3&&Number(getComputedStyle(c).opacity)>.99;
    }''',arg={'id':option,'i':scene},timeout=30000)

def issues_for(snapshot,width,height,check_text=True):
    errors=[]
    if snapshot['overflow']:errors.append('Horizontal document overflow')
    if snapshot['cacheCount']>2:errors.append('Decoded atlas cache exceeds two entries')
    if snapshot['cacheBytes']>(20000000 if width<=700 else 80000000):errors.append('Decoded atlas budget exceeded')
    if abs(sum(layer['opacity'] for layer in snapshot['layers'])-1)>.02:errors.append('Layer dissolve leaves a blank/overfull composition')
    for layer in snapshot['layers']:
        if layer['visibility']=='hidden' or layer['opacity']<.01:continue
        canvas=layer['canvas'];poster=layer['poster']
        if not ((canvas and canvas['pixels'] and canvas['opacity']>.99 and canvas['pixels']['opaque']>240) or (poster and poster['ready'])):
            errors.append('Visible layer has neither a decoded frame nor a loaded fallback')
        if canvas and width<=700 and canvas['width']>600:errors.append('Phone canvas exceeds 600px frame width')
    if check_text:
        for item in snapshot['texts']:
            r=item['rect']
            if r['x']< -2 or r['right']>width+2 or r['y']< -2 or r['bottom']>height+2:errors.append('Caption leaves viewport: '+item['text'][:75])
            nav=snapshot['jumps']
            if min(r['right'],nav['right'])-max(r['x'],nav['x'])>3 and min(r['bottom'],nav['bottom'])-max(r['y'],nav['y'])>3:errors.append('Caption overlaps keyboard step navigation: '+item['text'][:75])
    return errors

async def run_case(browser,case,args,reference,out):
    name,locale,width,height,reduced=case
    report={'case':name,'issues':[],'states':[],'reducedMotion':reduced}
    context=await browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce' if reduced else 'no-preference')
    page=await context.new_page();page.set_default_timeout(25000)
    page.on('pageerror',lambda e:report['issues'].append('Page error: '+str(e)))
    page.on('response',lambda r:report['issues'].append('Missing scroll asset: '+r.url) if '/art/tasso-scroll/' in r.url and r.status>=400 else None)
    try:
        response=await page.goto(args.origin.rstrip('/')+f'/{locale}/review/tasso-options',wait_until='domcontentloaded')
        assert response.status==200,'Comparison page status '+str(response.status)
        await page.locator('[data-scroll-only]').wait_for()
        await page.evaluate('document.fonts.ready')
        await page.wait_for_function('''reduced=>document.querySelector('[data-reduced-motion]')?.dataset.reducedMotion===String(reduced)''',arg=reduced)
        assert await page.locator('video,audio').count()==0,'Scroll comparison contains media elements'
        assert await page.get_by_role('button',name=__import__('re').compile(r'\b(play|pause|replay|reproducir|pausar)\b',__import__('re').I)).count()==0,'Playback control remains'
        assert await page.locator('[data-film-option]').count()==4,'Expected original plus three directions'
        assert await page.locator('.tasso-scroll-ready.is-ready').count()==3,'Some preserved sequence is not ready'
        if reduced:
            assert await page.locator('canvas').count()==0,'Reduced motion still mounts an animated canvas'
            for option in IDS:
                panel=page.locator(f'[data-film-option="{option}"]')
                assert await panel.locator('[data-tasso-static-step]').count()==3,'Static equivalent is incomplete'
                image=panel.locator('[data-tasso-dashboard]')
                await image.scroll_into_view_if_needed()
                await image.evaluate('i=>i.decode()')
                assert urlparse(await image.evaluate('i=>i.currentSrc')).path==reference['src'],'Static step3 uses a different dashboard'
                await panel.locator('[data-tasso-static-step="2"]').screenshot(path=str(out/f'{name}-{option}-dashboard.png'))
            report['staticSteps']=9
        else:
            for option in IDS:
                panel=page.locator(f'[data-film-option="{option}"]')
                for step,progress in [(0,.20),(1,.52),(2,.86)]:
                    await seek(page,option,progress)
                    if step<2:await frame_ready(page,option,step)
                    else:await panel.locator('[data-tasso-dashboard]').evaluate('i=>i.decode()')
                    state=await page.evaluate(SNAPSHOT,option)
                    assert state['step']==step,'Wrong scroll-selected semantic step'
                    report['issues']+=issues_for(state,width,height)
                    if step==2:
                        image=state['dashboard']
                        assert image['ready'] and image['opacity']>.98,'Actual dashboard is not visible'
                        assert urlparse(image['src']).path==reference['src'],'Step3 uses a different dashboard'
                        assert (image['width'],image['height'])==(reference['width'],reference['height']),'Dashboard dimensions changed'
                        assert '2 ' in state['caption'] and 'laborator' in state['caption'].lower(),'Lab-receipt timing missing'
                    report['states'].append({'option':option,**state})
                    await panel.locator('[data-tasso-scroll-stage]').screenshot(path=str(out/f'{name}-{option}-step-{step}.png'))

                # Actual keyboard event must invoke the same scroll-driven state.
                button=panel.locator('[data-tasso-jump="1"]')
                await button.evaluate('b=>b.focus({preventScroll:true})')
                await page.keyboard.press('Enter')
                await frame_ready(page,option,1)
                assert await button.get_attribute('aria-pressed')=='true','Keyboard step jump did not update selection'
                assert await button.evaluate('b=>document.activeElement===b'),'Keyboard jump lost focus'

            # Real decoded pixels must change with scroll, freeze at rest and
            # restore at the same position on reverse traversal.
            await seek(page,'studio',.44);await frame_ready(page,'studio',1)
            start=await page.evaluate(SNAPSHOT,'studio')
            await page.wait_for_timeout(650)
            stopped=await page.evaluate(SNAPSHOT,'studio')
            assert start['layers'][1]['canvas']['pixels']==stopped['layers'][1]['canvas']['pixels'],'Canvas changes while scroll is stopped'
            assert start['layers'][1]['canvas']['frame']==stopped['layers'][1]['canvas']['frame'],'Frame clock advances while stopped'
            await seek(page,'studio',.60);await frame_ready(page,'studio',1)
            forward=await page.evaluate(SNAPSHOT,'studio')
            assert start['layers'][1]['canvas']['pixels']['hash']!=forward['layers'][1]['canvas']['pixels']['hash'],'Scroll does not change actual canvas pixels'
            await seek(page,'studio',.44);await frame_ready(page,'studio',1)
            reverse=await page.evaluate(SNAPSHOT,'studio')
            assert start['layers'][1]['canvas']['pixels']==reverse['layers'][1]['canvas']['pixels'],'Reverse scroll does not restore the same image'
            report['pixelScrollChecks']={'stopped':True,'forward':True,'reverse':True}
            for progress in [.35,.36,.37,.66,.68,.70]:
                await seek(page,'studio',progress)
                state=await page.evaluate(SNAPSHOT,'studio')
                report['issues']+=issues_for(state,width,height,check_text=False)
                report['states'].append({'option':'studio','boundary':True,**state})
                await page.locator('[data-film-option="studio"] [data-tasso-scroll-stage]').screenshot(path=str(out/f'{name}-boundary-{progress}.png'))
        assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+2'),'Horizontal document overflow'
    except Exception as e:
        report['issues'].append(type(e).__name__+': '+str(e))
        await page.screenshot(path=str(out/f'{name}-failure.png'))
    finally:await context.close()
    report['issues']=list(dict.fromkeys(report['issues']));report['passed']=not report['issues']
    print(json.dumps({'case':name,'passed':report['passed'],'issues':report['issues']},ensure_ascii=False),flush=True)
    return report

async def main(args):
    reference=json.loads((ROOT/'docs/tasso-dashboard-reference.json').read_text())
    source=ROOT/'public'/reference['src'].lstrip('/')
    assert hashlib.sha256(source.read_bytes()).hexdigest()==reference['sha256'],'Approved actual dashboard asset changed'
    manifest=json.loads((ROOT/'lib/site-content/tasso-scroll-options.json').read_text())
    assert manifest['dashboard']['ready'] and manifest['dashboard']['src']==reference['src'],'Manifest does not use approved dashboard'
    for option in manifest['options']:
        assert len(option['scenes'])==2,'Only collection/return use image sequences'
        for scene in option['scenes']:
            assert scene['ready'] and scene['frameCount']==60,'Frame sequence incomplete'
            for path in [scene['poster'],*scene['atlases']]:assert (ROOT/'public'/path.lstrip('/')).is_file(),'Missing '+path
    out=Path(args.out)/f'loop-{args.loop}';out.mkdir(parents=True,exist_ok=True)
    reports=[]
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        for case in CASES:
            if args.case and case[0] not in args.case:continue
            reports.append(await run_case(browser,case,args,reference,out))
            (out/'browser-report.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2))
        await browser.close()
    if any(not r['passed'] for r in reports):raise SystemExit(1)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--origin',default='http://127.0.0.1:4175');parser.add_argument('--out',default='/workspace/eva-tasso-scroll-review');parser.add_argument('--loop',type=int,choices=[1,2,3],default=1);parser.add_argument('--case',action='append',choices=[c[0] for c in CASES]);asyncio.run(main(parser.parse_args()))
