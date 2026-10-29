"""Focused Light-only scroll acceptance. Run through npm; never judges craft alone.

Tests rendered pixels and the independently projected opaque carrier inset, not
only component diagnostics. Original/Studio/Morning source and pixel baselines
remain pinned to the previously approved comparison.
"""
import argparse
import asyncio
import hashlib
import importlib.util
import json
import math
import re
from pathlib import Path
from urllib.parse import urlparse
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('legacy_scroll', ROOT/'scripts/check-film-options.py')
legacy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(legacy)
CASES = legacy.CASES
LEGACY_IDS = ['original', 'studio', 'morning']

SNAPSHOT = r'''() => {
 const root=document.querySelector('[data-light-cinematic]'),stage=root.querySelector('[data-light-stage]'),canvas=root.querySelector('[data-light-canvas]'),paper=root.querySelector('[data-light-paper]');
 const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
 const pixels=c=>{const t=document.createElement('canvas');t.width=32;t.height=32;const x=t.getContext('2d',{willReadFrequently:true});x.drawImage(c,0,0,32,32);const d=x.getImageData(0,0,32,32).data;let h=2166136261,opaque=0;for(let i=0;i<d.length;i++){h=Math.imul(h^d[i],16777619);if(i%4===3&&d[i]>250)opaque++}return {hash:(h>>>0).toString(16),opaque}};
 const s=getComputedStyle(paper),sr=stage.getBoundingClientRect(),w=parseFloat(s.width),h=parseFloat(s.height),m=new DOMMatrix(s.transform),o=s.transformOrigin.split(' ').map(parseFloat);
 // Inset is the opaque, verified interior of the photographed PNG, never its
 // transparent wrapper. Older JPEG carrier has a fully opaque [0,0,1,1] face.
 const inset=(paper.dataset.paperInset||'0,0,1,1').split(',').map(Number);
 const pt=(x,y)=>{const p=new DOMPoint(x-o[0],y-o[1]).matrixTransform(m);return {x:sr.x+paper.offsetLeft+o[0]+p.x,y:sr.y+paper.offsetTop+o[1]+p.y}};
 const polygon=[[inset[0],inset[1]],[inset[0]+inset[2],inset[1]],[inset[0]+inset[2],inset[1]+inset[3]],[inset[0],inset[1]+inset[3]]].map(([x,y])=>pt(x*w,y*h));
 const inside=p=>{let signs=[];for(let i=0;i<4;i++){const a=polygon[i],b=polygon[(i+1)%4];signs.push((b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x))}return signs.every(v=>v>=-.1)||signs.every(v=>v<=.1)};
 const corners=[{x:sr.x-sr.width*.05,y:sr.y-sr.height*.05},{x:sr.right+sr.width*.05,y:sr.y-sr.height*.05},{x:sr.right+sr.width*.05,y:sr.bottom+sr.height*.05},{x:sr.x-sr.width*.05,y:sr.bottom+sr.height*.05}];
 const caption=root.querySelector('[data-light-caption][aria-hidden="false"]');
 const text=caption?[...caption.querySelectorAll('h3,p,a')].map(e=>({text:e.textContent.trim(),box:box(e)})):[];
 let brightMediaBehindCopy=0;
 if(canvas.dataset.sourceScene==='insight'&&text.length){
   const t=document.createElement('canvas');t.width=Math.ceil(sr.width/4);t.height=Math.ceil(sr.height/4);const x=t.getContext('2d',{willReadFrequently:true});x.drawImage(canvas,0,0,t.width,t.height);const d=x.getImageData(0,0,t.width,t.height).data;let total=0,bright=0;
   for(const item of text){const b=item.box;for(let y=Math.max(0,Math.ceil((b.y-sr.y)/4));y<Math.min(t.height,(b.bottom-sr.y)/4);y+=2)for(let k=Math.max(0,Math.ceil((b.x-sr.x)/4));k<Math.min(t.width,(b.right-sr.x)/4);k+=2){const i=(y*t.width+k)*4;total++;if(d[i]>130&&d[i+1]>130&&d[i+2]>110)bright++;}}
   brightMediaBehindCopy=bright/Math.max(1,total);
 }
 const image=paper.querySelector('img');
 return {progress:Number(root.dataset.lightProgress),scene:canvas.dataset.sourceScene,frame:canvas.dataset.renderedFrame,atlas:canvas.dataset.atlasSrc,pixels:pixels(canvas),canvasOpacity:Number(getComputedStyle(canvas).opacity),canvasCount:root.querySelectorAll('canvas').length,uiState:root.dataset.lightUiState,paper:{visible:s.visibility==='visible',opacity:Number(s.opacity),loaded:image.complete&&image.naturalWidth>0,src:image.currentSrc,inset,polygon,covers:corners.every(inside),diagnostic:root.dataset.paperFullCover},caption:caption?.textContent.trim(),texts:text,brightMediaBehindCopy,nav:box(root.querySelector('.light-step-shortcuts')),cacheCount:Number(root.dataset.lightCacheCount||0),cacheBytes:Number(root.dataset.lightCacheBytes||0),overflow:document.documentElement.scrollWidth>innerWidth+2};
}'''

def dashboard_frame(p, states, last):
    def smooth(t):
        t = max(0, min(1, t))
        return t*t*(3-2*t)
    def mix(a,b,t): return math.floor(a+(b-a)*smooth(t)+.5)
    if p<.70:return mix(0,states['signature'],(p-.61)/.09)
    if p<.74:return mix(states['signature'],states['apob'],(p-.70)/.04)
    if p<.80:return states['apob']
    if p<.84:return mix(states['apob'],states['hscrp'],(p-.80)/.04)
    if p<.90:return states['hscrp']
    if p<.94:return mix(states['hscrp'],states['closed'],(p-.90)/.04)
    return mix(states['closed'],last,(p-.94)/.02)

async def seek(page, p, manifest):
    await page.evaluate('''p=>{const r=document.querySelector('[data-light-cinematic]'),s=r.querySelector('[data-light-stage]');scrollTo({top:r.getBoundingClientRect().top+scrollY+(r.offsetHeight-s.offsetHeight)*p,behavior:'instant'})}''',p)
    await page.wait_for_function('''p=>Math.abs(Number(document.querySelector('[data-light-cinematic]').dataset.lightProgress)-p)<.003''',arg=p)
    scene=0 if p<.293 else 1 if p<.566 else 2
    states={s['id']:s['frame'] for s in manifest['scenes'][2]['states']}
    expected=dashboard_frame(p,states,manifest['scenes'][2]['frameCount']-1) if scene==2 else math.floor(max(0,min(1,p/.22 if scene==0 else (p-.39)/.11))*59+.5)
    await page.wait_for_function(r'''({scene,frame})=>{const c=document.querySelector('[data-light-canvas]');return c.dataset.sourceScene===scene&&/^\d+$/.test(c.dataset.renderedFrame||'')&&Math.abs(Number(c.dataset.renderedFrame)-frame)<1.1}''',arg={'scene':manifest['scenes'][scene]['id'],'frame':expected},timeout=30000)
    await page.wait_for_timeout(80)
    return await page.evaluate(SNAPSHOT)

def check_state(state,width,height,text=True):
    errors=[]
    if state['overflow']:errors.append('Horizontal document overflow')
    if state['canvasCount']!=1:errors.append('Light must use one source canvas')
    if state['canvasOpacity']!=1:errors.append('Source canvas is not fully opaque')
    if state['pixels']['opaque']!=1024:errors.append('Rendered canvas has transparent/blank pixels')
    if state['cacheCount']>2:errors.append('Light decoded cache exceeds two atlases')
    if state['cacheBytes']>(45000000 if width<=700 else 80000000):errors.append('Light atlas memory budget exceeded')
    if text:
        if state['brightMediaBehindCopy']>.03:errors.append('Real dashboard pixels overlap process copy; inspect media/copy composition')
        if not state['caption']:errors.append('No semantic step caption visible')
        for item in state['texts']:
            b=item['box'];nav=state['nav']
            if b['x']< -2 or b['right']>width+2 or b['y']< -2 or b['bottom']>height+2:errors.append('Caption leaves viewport: '+item['text'][:60])
            if min(b['right'],nav['right'])-max(b['x'],nav['x'])>3 and min(b['bottom'],nav['bottom'])-max(b['y'],nav['y'])>3:errors.append('Caption overlaps step jumps: '+item['text'][:60])
    return errors

async def legacy_regression(page,name,reference,report):
    for expected in reference['renderedCases'][name]:
        option,step=expected['option'],expected['step']
        if option not in LEGACY_IDS:continue
        await legacy.seek(page,option,[.20,.52,.86][step])
        if step<2:await legacy.frame_ready(page,option,step)
        else:await page.locator(f'[data-film-option="{option}"] [data-tasso-dashboard]').evaluate('i=>i.decode()')
        state=await page.evaluate(legacy.SNAPSHOT,option)
        assert state['caption']==expected['caption'],f'{option} caption changed'
        if step<2:
            actual=state['layers'][step]['canvas']
            assert actual['frame']==expected['frame'] and actual['pixels']==expected['pixels'],f'{option} rendered pixels/frame changed'
        else:
            assert urlparse(state['dashboard']['src']).path==reference['dashboard']['src'],f'{option} dashboard changed'
    report['legacyPixelRegression']='Original, Studio and Morning match approved frames and captions'

async def run_case(browser,case,args,manifest,reference,out):
    name,locale,width,height,reduced=case
    report={'case':name,'issues':[],'states':[],'reducedMotion':reduced}
    context=await browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce' if reduced else 'no-preference')
    page=await context.new_page();page.set_default_timeout(30000)
    page.on('pageerror',lambda e:report['issues'].append('Page error: '+str(e)))
    page.on('response',lambda r:report['issues'].append('Missing asset: '+r.url) if '/art/tasso-' in r.url and r.status>=400 else None)
    try:
        response=await page.goto(args.origin.rstrip('/')+f'/{locale}/review/tasso-options',wait_until='domcontentloaded')
        assert response.status==200,'Comparison route failed'
        await page.locator('[data-light-cinematic]').wait_for()
        await page.evaluate('document.fonts.ready')
        await page.wait_for_function('''r=>document.querySelector('[data-reduced-motion]')?.dataset.reducedMotion===String(r)''',arg=reduced)
        assert await page.locator('[data-film-option]').count()==4,'Four comparison options not preserved'
        assert await page.locator('video,audio').count()==0,'Media player remains'
        assert await page.get_by_role('button',name=re.compile(r'\b(play|pause|replay|reproducir|pausar)\b',re.I)).count()==0,'Playback control remains'
        root=page.locator('[data-light-cinematic]')
        if reduced:
            assert await root.get_attribute('data-light-reduced') is not None,'Reduced Light state did not mount'
            assert await root.locator('canvas').count()==0,'Reduced Light mounts animated canvas'
            assert await root.locator('[data-light-static]').count()==3,'Reduced Light misses a step'
            for step in range(3):
                panel=root.locator(f'[data-light-static="{step}"]')
                image=panel.locator('img');await image.scroll_into_view_if_needed();await image.evaluate('i=>i.decode()')
                assert urlparse(await image.evaluate('i=>i.currentSrc')).path==manifest['scenes'][step]['poster'],'Static source changed'
                assert await panel.locator('h3').inner_text(),'Static step lacks heading'
                await panel.screenshot(path=str(out/f'{name}-static-{step}.png'))
            report['staticSteps']=3
        else:
            stage=root.locator('[data-light-stage]')
            held={}
            for label,p in [('collect',.12),('return',.44),('signature',.70),('apob',.77),('hscrp',.87),('closed',.98)]:
                state=await seek(page,p,manifest);held[label]=state
                report['issues']+=check_state(state,width,height)
                if label in ['signature','apob','hscrp','closed']:
                    assert '2 ' in state['caption'] and 'laborator' in state['caption'].lower(),'Results timing lacks laboratory-receipt qualifier'
                    assert ('example' if locale=='en' else 'ejemplo') in state['caption'].lower(),'Actual interface lacks example-data context'
                report['states'].append({'label':label,**state})
                await stage.screenshot(path=str(out/f'{name}-{label}.png'))
            assert held['apob']['frame']!=held['hscrp']['frame'],'UI states use a single frame'
            assert held['apob']['pixels']['hash']!=held['hscrp']['pixels']['hash'],'Actual UI pixels do not change'
            await seek(page,.77,manifest);start=await page.evaluate(SNAPSHOT)
            await page.wait_for_timeout(650);stopped=await page.evaluate(SNAPSHOT)
            assert (start['frame'],start['pixels'])==(stopped['frame'],stopped['pixels']),'Motion advances while scroll is stopped'
            await seek(page,.87,manifest);reverse=await seek(page,.77,manifest)
            assert (start['frame'],start['pixels'])==(reverse['frame'],reverse['pixels']),'Reverse fails to restore exact canvas pixels'
            report['pixelScrollChecks']={'multipleActualUIStates':True,'stopped':True,'reverse':True}
            edit_images={}
            for p in [.292,.294,.565,.567]:
                state=await seek(page,p,manifest)
                inset=manifest['carrier'].get('opaqueInset')
                if inset:
                    expected_inset=[inset['left'],inset['top'],1-inset['left']-inset['right'],1-inset['top']-inset['bottom']]
                    assert all(abs(a-b)<.0001 for a,b in zip(state['paper']['inset'],expected_inset)),'Coverage uses wrapper bounds instead of approved opaque inset'
                assert state['paper']['visible'] and state['paper']['loaded'] and state['paper']['opacity']==1,'Edit is not behind a loaded opaque photograph'
                assert state['paper']['covers'],'Verified opaque carrier inset does not cover all four stage corners with 5% margin'
                report['issues']+=check_state(state,width,height,text=False)
                report['states'].append({'hiddenEdit':True,**state})
                edit_images[p]=hashlib.sha256(await stage.screenshot(path=str(out/f'{name}-edit-{p}.png'))).hexdigest()
            assert edit_images[.292]==edit_images[.294],'First hidden source edit changes visible stage pixels'
            assert edit_images[.565]==edit_images[.567],'Second hidden source edit changes visible stage pixels'
            report['hiddenEditPixelIdentity']=True
            if name in ['en-desktop','es-phone']:
                for p in [.22,.25,.27,.282,.304,.32,.34,.50,.53,.554,.578,.592,.61]:
                    state=await seek(page,p,manifest)
                    report['issues']+=check_state(state,width,height,text=False)
                    await stage.screenshot(path=str(out/f'{name}-transition-{p}.png'))
            for index,p in enumerate([.12,.44,.77]):
                button=root.locator(f'[data-light-jump="{index}"]')
                await button.evaluate('b=>b.focus({preventScroll:true})');await page.keyboard.press('Enter')
                await page.wait_for_function('''p=>Math.abs(Number(document.querySelector('[data-light-cinematic]').dataset.lightProgress)-p)<.003''',arg=p)
                assert await button.get_attribute('aria-pressed')=='true','Keyboard jump did not select step'
                assert await button.get_attribute('aria-current')=='step','Keyboard jump lacks current-step semantics'
                assert await button.evaluate('b=>document.activeElement===b'),'Keyboard jump lost focus'
            if name in ['en-desktop','es-phone']:await legacy_regression(page,name,reference,report)
        assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth+2'),'Horizontal overflow'
    except Exception as e:
        report['issues'].append(type(e).__name__+': '+str(e))
        await page.screenshot(path=str(out/f'{name}-failure.png'))
    finally:await context.close()
    report['issues']=list(dict.fromkeys(report['issues']));report['passed']=not report['issues']
    print(json.dumps({'case':name,'passed':report['passed'],'issues':report['issues']},ensure_ascii=False),flush=True)
    return report

async def main(args):
    manifest=json.loads((ROOT/'lib/site-content/tasso-light-cinematic.json').read_text())
    reference=json.loads((ROOT/'docs/tasso-light-regression-reference.json').read_text())
    authentic=json.loads((ROOT/'docs/tasso-light-source-reference.json').read_text())
    assert manifest['scenes'][2]==authentic['scene'],'Approved real dashboard scene changed'
    assert hashlib.sha256((ROOT/authentic['recording']['path']).read_bytes()).hexdigest()==authentic['recording']['sha256'],'Actual dashboard source recording changed'
    for path,digest in authentic['files'].items():assert hashlib.sha256((ROOT/'public'/path.lstrip('/')).read_bytes()).hexdigest()==digest,'Actual dashboard capture asset changed: '+path
    old=json.loads((ROOT/'lib/site-content/tasso-scroll-options.json').read_text())
    assert [o for o in old['options'] if o['id'] in LEGACY_IDS]==reference['options'],'Frozen legacy manifest changed'
    assert old['dashboard']==reference['dashboard'],'Frozen legacy dashboard manifest changed'
    for path,digest in reference['files'].items():assert hashlib.sha256((ROOT/'public'/path.lstrip('/')).read_bytes()).hexdigest()==digest,'Frozen asset changed: '+path
    assert manifest['carrier']['ready'] and len(manifest['scenes'])==3,'Light sources incomplete'
    assert {s['id'] for s in manifest['scenes'][2]['states']}=={'signature','apob','hscrp','closed'},'Actual interface interaction states missing'
    for scene in manifest['scenes']:
        for path in [scene['poster'],*scene['atlases']]:assert (ROOT/'public'/path.lstrip('/')).is_file(),'Missing '+path
    out=Path(args.out)/f'loop-{args.loop}';out.mkdir(parents=True,exist_ok=True)
    reports=[]
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        for case in CASES:
            if args.case and case[0] not in args.case:continue
            reports.append(await run_case(browser,case,args,manifest,reference,out))
            (out/'browser-report.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2))
        await browser.close()
    if any(not r['passed'] for r in reports):raise SystemExit(1)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--origin',default='http://127.0.0.1:4175');parser.add_argument('--out',default='/workspace/eva-light-cinematic-review');parser.add_argument('--loop',type=int,choices=[1,2,3],default=1);parser.add_argument('--case',action='append',choices=[c[0] for c in CASES]);asyncio.run(main(parser.parse_args()))
