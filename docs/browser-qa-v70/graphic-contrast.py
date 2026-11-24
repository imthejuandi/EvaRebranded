from pathlib import Path
from PIL import Image
import json,math
p=Path('/workspace/eva-in-place-qa/range-edit-v70');actual=json.loads((p/'native-qa.json').read_text());out=[]
def lum(rgb):
 c=[v/255 for v in rgb];c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c];return .2126*c[0]+.7152*c[1]+.0722*c[2]
for c in json.loads((p/'native.json').read_text())['profiles']:
 a=next(x for x in actual['profiles'] if x['locale']==c['locale'] and x['width']==c['width'] and not x.get('reduced'));g=a['closed']['glass'];im=Image.open(p/f"native-background-{c['locale']}-{c['width']}.png").convert('RGB');minimum=100
 for t in a['closed']['rows']:
  b=t['track'];point=t['point'];cx=point['x']+point['width']/2;cy=point['y']+point['height']/2
  for col in range(55):
   if col/54*5>=t['end']:continue
   for row in range(2):
    x=b['x']+col/54*b['width'];y=b['y']+11+row*6
    if math.hypot(x-cx,y-cy)<10:continue
    ix=min(im.width-1,max(0,round(x-g['x'])));iy=min(im.height-1,max(0,round(y-g['y'])));bg=im.getpixel((ix,iy));fg=[round(.8*a+.2*z) for a,z in zip((255,253,246),bg)];ratio=(lum(fg)+.05)/(lum(bg)+.05);minimum=min(minimum,ratio)
 out.append({'locale':c['locale'],'width':c['width'],'minimum':round(minimum,2),'passed':minimum>=3})
r={'method':'Composited .8 warm-white core of essential interval dots against actual native glass sampled at each dot centre, excluding occluded ring. Dim outside dots are contextual background. This is core compositing, not edge antialiasing/physical-screen measurement.','profiles':out,'passed':all(x['passed'] for x in out)};(p/'native-graphic-contrast.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r));raise SystemExit(0 if r['passed'] else 1)
