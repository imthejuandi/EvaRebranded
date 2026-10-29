import cv2, numpy as np, subprocess, json
from PIL import Image
src='/home/user/eva-track.mp4'
cap=cv2.VideoCapture(src)
ok,first=cap.read()
assert ok
h,w=first.shape[:2]
gray0=cv2.cvtColor(first,cv2.COLOR_BGR2GRAY)
features=np.zeros((h,w),np.uint8);features[487:676,156:273]=255
p0=cv2.goodFeaturesToTrack(gray0,maxCorners=220,qualityLevel=.006,minDistance=3,mask=features)
assert p0 is not None and len(p0)>20
roi=np.zeros((h,w),np.uint8);roi[529:595,182:279]=255
logo=Image.open('/home/user/eva-logo.png').convert('RGBA')
alpha=np.array(logo)[:,:,3]
if alpha.min()==255:
 alpha=(np.array(logo)[:,:,:3].max(axis=2)>8).astype(np.uint8)*255
ys,xs=np.nonzero(alpha)
alpha=alpha[ys.min():ys.max()+1,xs.min():xs.max()+1]
lw=94;lh=round(lw*alpha.shape[0]/alpha.shape[1])
alpha=cv2.resize(alpha,(lw,lh),interpolation=cv2.INTER_AREA).astype(np.float32)/255
layer=np.zeros((h,w),np.float32);layer[538:538+lh,185:185+lw]=alpha
enc=subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r','24','-i','-','-an','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','/home/user/eva-composite.mp4'],stdin=subprocess.PIPE)
cap.set(cv2.CAP_PROP_POS_FRAMES,0)
records=[];lastH=np.eye(3)
while True:
 ok,frame=cap.read()
 if not ok:break
 gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
 p1,st,err=cv2.calcOpticalFlowPyrLK(gray0,gray,p0,None,winSize=(31,31),maxLevel=3)
 good=(st[:,0]==1)&(err[:,0]<25)
 H,inliers=cv2.findHomography(p0[good],p1[good],cv2.RANSAC,2.0)
 if H is None or int(inliers.sum())<15:H=lastH
 lastH=H
 movingROI=cv2.warpPerspective(roi,H,(w,h),flags=cv2.INTER_NEAREST)
 textmask=((gray<196)&(movingROI>0)).astype(np.uint8)*255
 textmask=cv2.dilate(textmask,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(3,3)))
 clean=cv2.inpaint(frame,textmask,4,cv2.INPAINT_TELEA)
 rgb=cv2.cvtColor(clean,cv2.COLOR_BGR2RGB).astype(np.float32)/255
 soft=cv2.GaussianBlur(rgb,(0,0),.7)
 base=rgb*.84+soft*.16
 highlights=np.clip((rgb-.45)/.55,0,1)
 bloom=cv2.GaussianBlur(highlights,(0,0),14)
 lit=1-(1-base)*(1-bloom*.40)
 a=cv2.warpPerspective(layer,H,(w,h),flags=cv2.INTER_LINEAR)
 lit=lit*(1-a[:,:,None])
 enc.stdin.write(np.uint8(np.clip(lit,0,1)*255).tobytes())
 corners=cv2.perspectiveTransform(np.float32([[[185,538],[279,538],[279,572],[185,572]]]),H)[0]
 records.append({'frame':len(records),'inliers':int(inliers.sum()) if inliers is not None else 0,'corners':corners.round(2).tolist()})
enc.stdin.close();assert enc.wait()==0
cap.release()
assert len(records)==96
json.dump({'frames':len(records),'logoNativePixels':True,'taglineRemoved':True,'tracking':records,'glow':'RGB highlight extraction .45, Gaussian sigma14, screen opacity .40, diffusion .7 mixed16%'},open('/home/user/eva-composite-tracking.json','w'),indent=2)
print(json.dumps({'frames':len(records),'minInliers':min(x['inliers'] for x in records),'logoSize':[lw,lh],'alphaRange':[int(alpha.min()*255),int(alpha.max()*255)]}))

