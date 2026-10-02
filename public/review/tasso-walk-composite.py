import cv2,numpy as np,subprocess,json,os,math
from PIL import Image,ImageDraw,ImageFilter,ImageFont
cap=cv2.VideoCapture('source.mp4');fps=cap.get(cv2.CAP_PROP_FPS);frames=[]
while True:
 ok,a=cap.read()
 if not ok:break
 frames.append(a)
N=len(frames);H,W=frames[0].shape[:2];grays=[cv2.cvtColor(x,cv2.COLOR_BGR2GRAY) for x in frames]
# t,x,y,width,rotation; positions are manually reviewed upper-arm centers.
guides=[
[[0,153,554,8,-8],[.5,165,553,8.2,-8],[1,174,551,8.5,-12],[1.5,188,551,9,-8],[2,205,548,9.2,-8],[2.5,224,544,9.5,-13],[3,241,545,10,-13],[3.5,258,537,10.5,-15],[4,268,523,11,-8],[4.5,307,525,11.5,-8],[5,333,518,12,-12],[5.5,368,521,13,0],[6,382,512,14,-12],[6.5,460,507,16,0],[7,547,515,17,-13],[7.25,660,520,18,-13],[7.5,790,520,19,-13],[9.3,1400,520,19,-13]],
[[0,359,552,9,12],[.5,401,551,9.2,8],[1,420,542,9.5,15],[1.5,445,547,10,5],[2,477,536,10.5,15],[2.5,489,535,11,8],[3,533,528,11.5,15],[3.5,561,529,12,8],[4,594,524,12.5,8],[4.5,655,513,13,15],[5,674,520,14,8],[5.5,777,508,15,8],[6,900,508,15,8],[9.3,1600,508,15,8]]]
tracks=[]
for guide in guides:
 g=np.array(guide,float);out=np.zeros((N,4),float)
 for i in range(N):
  t=i/fps
  for k in range(4):out[i,k]=np.interp(t,g[:,0],g[:,k+1])
 for j in range(len(g)-1):
  a=min(N-1,round(g[j,0]*fps));b=min(N-1,round(g[j+1,0]*fps))
  if b<=a or not(20<g[j,1]<W-20):continue
  pt=np.array([[[g[j,1],g[j,2]]]],np.float32);raw=[pt[0,0].copy()]
  for k in range(a,b):
   nxt,st,err=cv2.calcOpticalFlowPyrLK(grays[k],grays[k+1],pt,None,winSize=(25,25),maxLevel=2,criteria=(cv2.TERM_CRITERIA_EPS|cv2.TERM_CRITERIA_COUNT,25,.01))
   if nxt is None or st[0,0]==0 or err[0,0]>45: nxt=np.array([[out[k+1,:2]]],np.float32)
   pt=nxt;raw.append(pt[0,0].copy())
  raw=np.array(raw);target=out[b,:2];corr=target-raw[-1]
  for k in range(a,b+1):
   f=(k-a)/(b-a);pred=raw[k-a]+corr*f;delta=np.clip(pred-out[k,:2],-4,4);out[k,:2]+=delta
 tracks.append(out)
# Extract actual Tasso product, retaining enclosed white highlights.
im=np.array(Image.open('product.jpg').convert('RGB'));near=(im.min(axis=2)>249).astype(np.uint8);flood=near.copy();cv2.floodFill(flood,None,(0,0),2);alpha=(flood!=2).astype(np.uint8)*255
ys,xs=np.where(alpha>0);box=(xs.min(),ys.min(),xs.max()+1,ys.max()+1);rgba=np.dstack([im,alpha])[box[1]:box[3],box[0]:box[2]]
sprite=Image.fromarray(rgba).resize((160,round(rgba.shape[0]*160/rgba.shape[1])),Image.Resampling.LANCZOS)
# Short clear vial below the photographed connector, softly shaded, not a tapered pin.
base=Image.new('RGBA',(220,sprite.height+100));base.alpha_composite(sprite,(30,4));dr=ImageDraw.Draw(base)
vialtop=sprite.height-1;dr.rounded_rectangle((100,vialtop,120,vialtop+44),radius=4,fill=(230,219,202,135),outline=(212,195,177,175),width=2);dr.line((103,vialtop+4,103,vialtop+36),fill=(255,246,234,135),width=2)
arr=np.array(base).astype(np.float32);arr[:,:,:3]*=np.array([.97,.83,.70]);base=Image.fromarray(arr.clip(0,255).astype('uint8'));base.save('tasso-cutout.png')
cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-an','-c:v','libx264','-preset','slow','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart','aire-libre-tasso-composite.mp4'];enc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
samples={};changed_max=0;rng=np.random.default_rng(42)
for i,src in enumerate(frames):
 out=src.copy()
 for tr in tracks:
  x,y,sw,ang=tr[i]
  if x<-40 or x>W+40:continue
  # Base160px corresponds to photographed shell width; bottom vial follows arm angle.
  scale=sw/160;sz=(max(1,round(base.width*scale)),max(1,round(base.height*scale)))
  piece=base.resize(sz,Image.Resampling.LANCZOS).rotate(float(ang),resample=Image.Resampling.BICUBIC,expand=True)
  # Photographed button center is slightly above sprite vertical midpoint.
  a=np.array(piece).astype(np.float32);a[:,:,:3]+=rng.normal(0,1.1,a[:,:,:3].shape);a=a.clip(0,255);ah,aw=a.shape[:2];left=round(x-aw/2);top=round(y-ah*.40)
  x0=max(0,left);y0=max(0,top);x1=min(W,left+aw);y1=min(H,top+ah)
  if x1<=x0 or y1<=y0:continue
  crop=a[y0-top:y1-top,x0-left:x1-left];al=crop[:,:,3:4]/255*.94;rgb=crop[:,:,:3][:,:,::-1]
  # Tiny warm contact shadow restricted to the device footprint.
  dst=out[y0:y1,x0:x1].astype(float);out[y0:y1,x0:x1]=(dst*(1-al)+rgb*al).astype('uint8')
 enc.stdin.write(out.tobytes())
 if i in [0,12,24,48,72,96,120,144,156,168,174,192,216]:samples[i]=Image.fromarray(cv2.cvtColor(out,cv2.COLOR_BGR2RGB));samples[i].save(f'composite-{i}.png')
enc.stdin.close();assert enc.wait()==0
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
sheet=Image.new('RGB',(1080,2000),'#ddd');sd=ImageDraw.Draw(sheet)
for k,n in enumerate([0,24,48,72,96,120,144,168,192]):
 im=samples[n].copy();im.thumbnail((350,630));sheet.paste(im,((k%3)*360+5,(k//3)*666+26));sd.text(((k%3)*360+10,(k//3)*666+6),f'{n/fps:.1f}s',font=font,fill='black')
sheet.save('aire-libre-tasso-composite-review.jpg',quality=95)
arms=Image.new('RGB',(1600,1200),'#ddd');ad=ImageDraw.Draw(arms)
for k,n in enumerate([0,24,48,96,144,168]):
 patch=samples[n].crop((100,430,720,720));patch=patch.resize((780,365));arms.paste(patch,((k%2)*800,(k//2)*400+30));ad.text(((k%2)*800+8,(k//2)*400+6),f'{n/fps:.1f}s upper arms',font=font,fill='black')
arms.save('aire-libre-tasso-composite-arms.jpg',quality=96)
for width in [600,1000]:
 im=samples[96];im.resize((width,round(width*H/W)),Image.Resampling.LANCZOS).save(f'aire-libre-tasso-composite-{width}.webp',quality=87,method=6)
json.dump({'fps':fps,'frames':N,'guides':guides,'tracks':[x.tolist() for x in tracks],'sprite':'Actual product photo flood-fill cutout + short translucent vial, warm color multiplication; bounded LK refinements capped4px'},open('composite-tracking.json','w'))
print(json.dumps({'frames':N,'fps':fps,'duration':N/fps,'bytes':os.path.getsize('aire-libre-tasso-composite.mp4'),'source_geometry_unchanged':True,'product_bounds':[int(z) for z in box]}))

