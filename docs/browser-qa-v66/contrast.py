from pathlib import Path
from PIL import Image
import json,re
root=Path('/workspace/eva-in-place-qa/range-retro-v66')
edge=json.loads((root/'edge-motion.json').read_text())
more=json.loads((root/'contrast-backgrounds.json').read_text())
profiles=[{**x,'width':1051} for x in edge['edge']]+more['profiles']
results=[]
def lum(rgb):
 c=[v/255 for v in rgb];c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c];return .2126*c[0]+.7152*c[1]+.0722*c[2]
for r in profiles:
 im=Image.open(root/f"background-{r['locale']}-{r['width']}.png").convert('RGB');g=r['glass']
 for t in r['labels']:
  b=t['box'];rect=(max(0,int(b['x']-g['x'])),max(0,int(b['y']-g['y'])),min(im.width,int(b['right']-g['x']+1)),min(im.height,int(b['bottom']-g['y']+1)))
  if rect[2]<=rect[0] or rect[3]<=rect[1]:continue
  rgb=tuple(map(int,re.findall(r'\d+',t['color'])[:3]));fg=lum(rgb);ratios=[(max(fg,lum(bg))+.05)/(min(fg,lum(bg))+.05) for bg in im.crop(rect).get_flattened_data()];minimum=min(ratios);required=3 if t['size']>=24 else 4.5
  results.append({'locale':r['locale'],'width':r['width'],'text':t['text'],'color':t['color'],'size':t['size'],'minimumContrast':round(minimum,2),'required':required,'passed':minimum>=required})
report={'method':'Conservative whole text bounding-box contrast against actual native glass with text made transparent. Grain/reflections/rim retained. Whole-box minimum may be lower than exact glyph-pixel contrast.','passed':all(x['passed'] for x in results),'profiles':len(profiles),'results':results};(root/'painted-contrast.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'passed':report['passed'],'profiles':report['profiles'],'minimum':min(x['minimumContrast'] for x in results),'failed':[x for x in results if not x['passed']]},ensure_ascii=False));raise SystemExit(0 if report['passed'] else 1)
