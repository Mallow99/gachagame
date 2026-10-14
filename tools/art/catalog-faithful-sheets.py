"""Inspect source-game row bands without resizing frames or changing palettes."""
from pathlib import Path
from PIL import Image,ImageDraw
import json
from functools import lru_cache
import numpy as np
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'assets/sprites/sources/faithful'
BG={
 'smb-bowser-alt':[(50,97,168),(147,187,236)],
 'smb-bowser-180958':[(27,89,153),(147,187,236),(87,143,204)],
 'smb-mario-luigi':[(0,41,140),(0,0,168),(146,144,255)],
 'smb-enemies':[(0,41,140),(0,0,168),(146,144,255)],
 'smb-npcs-items':[(0,41,140),(0,0,168),(146,144,255),(0,0,0)],
 'gb-kirby':[(0,130,0),(0,130,129),(255,0,0),(0,0,255)],
 'ka-meta-knight':[(0,255,255)],
 'ss-knuckle-joe':[(0,64,64),(64,128,128)],
 'ss-bio-spark':[(0,64,64),(64,128,128)],
 'bandana-adaptation':[(34,177,76)],
}
@lru_cache(maxsize=None)
def clean(name):
 im=Image.open(SOURCE/(name+'.png')).convert('RGBA')
 backgrounds=BG.get(name,[(84,110,140),(116,154,212)])
 im.putdata([(r,g,b,0 if (r,g,b) in backgrounds else a)for r,g,b,a in im.get_flattened_data()])
 return im
def spans(name,box):
 im=clean(name).crop(box);mask=np.asarray(im)[:,:,3]>0;labels,n=ndimage.label(mask,structure=np.ones((3,3)));frames=[]
 for i,obj in enumerate(ndimage.find_objects(labels),1):
  if obj is None:continue
  ys,xs=obj;w,h=xs.stop-xs.start,ys.stop-ys.start
  if w>=8 and h>=10 and w<110 and np.count_nonzero(labels[obj]==i)>=40:
   frames.append([box[0]+xs.start,box[1]+ys.start,box[0]+xs.stop,box[1]+ys.stop])
 return sorted(frames,key=lambda b:(b[1]//10,b[0]))
ROWS={
 'smb-mario-luigi':{'mario':[0,30,280,65],'luigi':[290,30,578,65]},
 'smb-npcs-items':{'npcs':[0,436,34,467]},
 'gb-kirby':{'idle':[1,13,69,29],'walk':[1,30,69,47],'inhale':[1,63,149,89],'puff':[1,89,178,114],'hurt':[1,115,136,131]},
 'ka-kirby':{'idle':[4,24,155,41],'walk':[4,49,123,66],'inhale':[4,78,276,99],'puff':[4,108,277,131],
   'star-flight':[4,519,266,550],'copy-neutral':[4,570,202,590],'fire':[4,857,122,877],'spark':[124,820,240,840],'ice':[121,857,415,877],
   'fireball':[4,891,408,920],'cutter':[4,1043,116,1094],'sword-swing':[4,1280,348,1322],'sword-walk':[4,1340,174,1370],'sword-jump':[4,1436,316,1468],'hammer-swing':[4,2007,288,2047],'hammer-walk':[4,2055,190,2088]},
 'ka-enemies':{'parasol':[94,23,173,58],'doo':[94,59,143,77],'sparky':[94,78,172,96],'laser':[94,98,205,115],
   'hot-head':[94,116,172,135],'chilly':[94,156,153,176],'kibble':[94,197,173,218],'rocky':[94,237,154,256],
   'wheelie':[94,257,154,275],'sword':[94,432,268,460],'blade':[94,532,268,557],
   'waddle':[94,657,135,677],'kabu':[94,701,215,724],'poppy':[94,757,173,847],'bronto':[94,897,135,914],'scarfy':[94,937,174,954]},
 'ka-midbosses':{'bonkers-idle':[7,711,366,746],'bonkers-hammer':[8,748,714,797]},
 'ka-dedede':{'idle':[25,415,99,452],'inhale':[25,453,318,489],'jump':[25,494,200,539],'hammer':[25,546,474,608],'hurt':[25,608,215,649]},
 'ka-meta-knight':{'intro':[4,345,225,374],'jump':[4,383,126,407],'walk':[4,413,181,435],'spin':[4,437,223,462],
   'up-slash':[4,488,159,525],'dash':[4,527,128,552],'counter':[4,550,53,568],
   'basic':[4,570,284,608],'blue-intro':[4,621,295,650],'blue-basic':[4,651,224,675],'blue-counter':[4,674,216,697]},
 'ss-bio-spark':{'idle':[8,16,89,47],'walk':[174,16,307,49],'knife':[8,145,80,185],'slash':[9,333,239,364],'dash':[8,416,553,457],'hurt':[8,480,183,515]},
 'ss-knuckle-joe':{'idle':[7,8,115,52],'walk':[215,8,391,52],'jump':[148,67,232,113],
   'jab':[7,326,106,363],'smash':[7,387,268,434],'kick':[7,449,270,500],'uppercut':[7,587,193,649],'hurt':[7,672,242,711]},
 'bandana-adaptation':{'idle':[8,34,82,79],'walk':[70,34,291,79],'hurt':[294,34,611,79],
   'thrust':[8,349,161,399],'back-thrust':[343,349,643,399],
   'throw':[489,455,632,494],'copter':[13,582,416,640],'copter-exit':[428,582,746,640]},
}
if __name__=='__main__':
 out=ROOT/'docs/validation/sprite-review';out.mkdir(parents=True,exist_ok=True);catalog={}
 for name,rows in ROWS.items():
  im=clean(name);records=[]
  for label,box in rows.items():
   frames=spans(name,box);records.append((label,frames));catalog[name+':'+label]=frames
  width=1000;sheet=Image.new('RGB',(width,len(records)*95),'#e8dfc9');draw=ImageDraw.Draw(sheet)
  for j,(label,frames)in enumerate(records):
   draw.text((8,j*95+6),name+' / '+label,fill='#332a23')
   for i,b in enumerate(frames[:20]):
    f=im.crop(b);scale=min(3,52/max(f.width,f.height));f=f.resize((max(1,int(f.width*scale)),max(1,int(f.height*scale))),Image.Resampling.NEAREST)
    sheet.paste(f,(i*49+7,j*95+27),f);draw.text((i*49+7,j*95+79),str(i),fill='#332a23')
  sheet.save(out/(name+'-rows.png'))
 (out/'row-catalog.json').write_text(json.dumps(catalog,indent=2)+'\n')
 print(json.dumps({key:len(value)for key,value in catalog.items()},indent=2))
