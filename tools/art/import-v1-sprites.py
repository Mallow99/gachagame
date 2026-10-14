"""Reproducible personal-use sprite extraction; run from the repository root.

Sources stay intact. Clips declare reused/reconstructed states in manifests;
all derived frames have a shared foot pivot and nearest-neighbor sampling.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageSequence
import json, hashlib, re

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'assets/sprites/sources'
OUT = ROOT / 'assets/sprites/v1'
OUT.mkdir(parents=True, exist_ok=True)
definitions = {}

def load(name):
    im = Image.open(SRC / name).convert('RGBA')
    if name in ['mario.png','luigi.png','toad.png','peach.png','Bowser.png','Lakitu.png']:
        im.putdata([(r,g,b,0 if (r,g,b)==(0,255,0) else a) for r,g,b,a in im.getdata()])
    return im

def rects(name, rectangles):
    im = load(name)
    return [im.crop((x,y,x+w,y+h)) for x,y,w,h in rectangles]

def grid(name, cols, rows, indexes=None):
    im = load(name); w,h = im.width//cols, im.height//rows
    indices = indexes or range(cols*rows)
    return [im.crop((i%cols*w,i//cols*h,(i%cols+1)*w,(i//cols+1)*h)) for i in indices]

def row(name,y1,y2,limit=8):
    im = load(name).crop((0,y1,440,y2))
    pixels=im.load(); spans=[];start=None
    for x in range(im.width+1):
        used=x<im.width and any(pixels[x,y][3] for y in range(im.height))
        if used and start is None:start=x
        if not used and start is not None:
            if x-start>=8:spans.append((start,x))
            start=None
    return [im.crop((a,0,b,im.height)) for a,b in spans[:limit]]

def animated(name):
    return [frame.convert('RGBA') for frame in ImageSequence.Iterator(Image.open(SRC/name))]

def palette(frames,colors):
    for frame in frames:
        frame.putdata([(*colors.get((r,g,b),(r,g,b)),a) for r,g,b,a in frame.getdata()])
    return frames

def export(key,frames,source,clips=None,cell=(64,64),height=32,notes='Source frames plus timed recoil, squash and marker-driven motion.'):
    cw,ch=cell;cols=min(8,len(frames));rows=(len(frames)+cols-1)//cols
    atlas=Image.new('RGBA',(cw*cols,ch*rows));out=[]
    for i,frame in enumerate(frames):
        box=frame.getbbox()
        if not box:raise ValueError(f'Empty source frame {key}:{i}')
        trimmed=frame.crop(box);target_h=min(height,ch-4)
        ratio=min(target_h/trimmed.height,(cw-4)/trimmed.width)
        size=(max(1,round(trimmed.width*ratio)),max(1,round(trimmed.height*ratio)))
        trimmed=trimmed.resize(size,Image.Resampling.NEAREST)
        x=(cw-trimmed.width)//2;y=ch-2-trimmed.height
        atlas.alpha_composite(trimmed,(i%cols*cw+x,i//cols*ch+y));out.append([i%cols*cw,i//cols*ch,cw,ch])
    path=OUT/(key+'.png');atlas.save(path)
    default={'idle':[0],'move_forward':list(range(min(4,len(frames)))),'move_back':list(range(min(4,len(frames)))),
      'basic_windup':[0],'basic_resolve':[min(1,len(frames)-1)],'skill_or_secondary':[min(2,len(frames)-1)],
      'hurt':[0],'knockout':[len(frames)-1],'ultimate_entry':[min(2,len(frames)-1)]}
    default.update(clips or {})
    definitions[key]={'url':'assets/sprites/v1/'+key+'.png','frames':out,'clips':default,'fps':8,'cell':list(cell),
      'pivot':[cw/2,ch-2],'nativeHeight':height,'facing': 'right' if key in ['mario','luigi','toad','peach','kirby','bandana','bandana-spear'] or key.startswith('kirby-') else 'left',
      'sourceFiles':source if isinstance(source,list) else [source], 'spriteGrade':'B','status':'provisional',
      'renderMode':'native-sprite','notes':notes,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
    icon=Image.new('RGBA',(128,128));f=atlas.crop((0,0,cw,ch));f=f.crop(f.getbbox());ratio=min(104/f.width,104/f.height);f=f.resize((max(1,round(f.width*ratio)),max(1,round(f.height*ratio))),Image.Resampling.NEAREST);icon.alpha_composite(f,((128-f.width)//2,120-f.height));icon.save(OUT/(key+'-icon.png'))

smb='smb-sprites.png'
export('mario',rects(smb,[(112+i*16,88,16,32) for i in range(6)]),smb,
  {'idle':[0],'move_forward':[1,2,3],'move_back':[1,2,3],'basic_resolve':[5],'skill_or_secondary':[5],'hurt':[4],'knockout':[4],'ultimate_entry':[5]})
export('luigi',grid('luigi.png',8,3,list(range(8))+[16,17]),'luigi.png',
  {'idle':[0],'move_forward':[1,2,3],'move_back':[1,2,3],'basic_resolve':[5],'skill_or_secondary':[8],'hurt':[4],'knockout':[9]},height=36,
  notes='Remastered source treatment. High apex, hang time and retreat are authored by the simulation.')
export('toad',grid('toad.png',8,3,list(range(8))+[16,17,18]),'toad.png',height=30,
  clips={'idle':[0],'move_forward':[1,2,3],'basic_resolve':[4,5,6],'skill_or_secondary':[8],'hurt':[9],'knockout':[10]},
  notes='Remastered source treatment; combo uses three poses. Delivery parcel is a persistent effect at hand contact.')
export('peach',grid('peach.png',3,1),'peach.png',height=34,
  clips={'move_forward':[0,1],'move_back':[0,1],'basic_resolve':[2],'skill_or_secondary':[2]},
  notes='Three-frame classic reconstruction: float and cast use distinct body poses, timed lift, dress squash and a held turnip. Hurt/KO are code-driven.')
export('goomba',rects(smb,[(80,0,16,16),(96,0,16,16),(112,0,16,16)]),smb,height=22,clips={'move_forward':[0,1],'knockout':[2]})
export('koopa',rects(smb,[(224,0,16,24),(240,0,16,24),(208,168,16,24),(208,192,16,24)]),smb,height=30,clips={'move_forward':[0,1],'skill_or_secondary':[2],'knockout':[2]})
export('piranha',rects(smb,[(240,72,16,24),(240,96,16,24)]),smb,height=32)
export('hammer-bro',rects(smb,[(0,48,16,24),(16,48,16,24)]),smb,height=32)
export('bowser',rects(smb,[(208,88,32,32),(208,120,32,32)]),smb,height=44)
export('blooper',rects(smb,[(128,48,16,24),(144,48,16,24)]),smb,height=27)
export('buzzy',rects(smb,[(0,16,16,16),(16,16,16,16)]),smb,height=22)
export('cheep',rects(smb,[(48,0,16,16),(64,0,16,16)]),smb,height=23)
export('lakitu',rects(smb,[(176,64,16,24)]),smb,height=31,notes='Native NES cloud rider; hover, stagger landing and cloud dive are procedural source-faithful motions.')
export('spiny',rects(smb,[(32,72,16,16),(48,72,16,16)]),smb,height=22)
export('bullet',rects(smb,[(128,0,16,16)]),smb,height=22)
export('podoboo',grid('Podoboo.png',1,1),'Podoboo.png',height=25)
export('super-mushroom',rects(smb,[(0,152,16,16)]),smb,height=32,notes='Native item source, separate equipment namespace; no fighter-kit replacement.')
export('life-mushroom',rects(smb,[(16,152,16,16)]),smb,height=32,notes='Declared green classic item treatment for the healing equipment record.')
export('mini-mushroom',rects(smb,[(32,152,16,16)]),smb,height=24,notes='Declared blue/small classic item treatment; bounded Heavy-hit proc remains independent of fighter art.')
export('fire-flower',rects(smb,[(0,168,16,16)]),smb,height=32,notes='Native classic Fire Flower item, effect-only equipment.')
flower=rects(smb,[(0,168,16,16)])
export('ice-flower',palette(flower,{(236,167,50):(115,187,239),(189,65,49):(62,107,174)}),smb,height=32,notes='Declared Ice palette reconstruction of the classic item source.')

kirbyframes=row('kirby.png',24,40,8)+row('kirby.png',49,65,6)+row('kirby.png',76,99,4)+row('kirby.png',232,261,4)
export('kirby',kirbyframes,'kirby.png',height=26,
  clips={'idle':[0,1],'move_forward':list(range(8,14)),'move_back':list(range(8,14)),
    'basic_windup':[14],'basic_resolve':[15,16],'skill_or_secondary':[15,16,17],'hurt':[18],'knockout':[19],'ultimate_entry':[15]},
  notes='Enhanced/expanded Kirby sheet from the source repository. Original game of this derivative is unverified; private prototype treatment, not claimed as an original NES rip.')
for key,(a,b) in {'kirby-fire':(624,640),'kirby-cutter':(1522,1569),'kirby-sword':(1114,1157),'kirby-hammer':(1835,1886),'kirby-beam':(2365,2397)}.items():
    frames=row('kirby.png',a,b,7)
    clips={'idle':[0],'move_forward':[0],'move_back':[0],'basic_windup':[0],'basic_resolve':[0],
      'skill_or_secondary':[2,4,6] if key=='kirby-fire' else [2,3,4],'hurt':[0],'knockout':[0],'ultimate_entry':[0]}
    export(key,frames,'kirby.png',height=30,clips=clips,notes='Copy-specific source body. Neutral/basic poses stay on the owner; Fireball uses the detached transformed source only during its charge skill. Contact comes from the profile, not a recycled projectile frame.')
for key,color in [('kirby-spark',(153,246,143)),('kirby-ice',(128,214,255))]:
    frames=[]
    for f in kirbyframes:
        im=f.copy();im.putdata([(color[0],color[1],color[2],alpha) if r>200 and g<220 and b<230 and r>g else (r,g,b,alpha) for r,g,b,alpha in im.getdata()]);frames.append(im)
    export(key,frames,'kirby.png',height=26,notes='Declared NES-style Copy palette reconstruction. Spark/ice overlays and distinct profile attacks are authored in the renderer.')

for key,file,cols,rows,indices,height in [
  ('waddle-dee','WaddleDee',1,8,None,25),('parasol','ParosolDee',1,8,None,35),('poppy','PoppyBrosJr',1,12,None,30),
  ('sir-kibble','SirKibble',1,7,None,30),('chilly','Chilly',1,11,None,27),('bronto','BrontoBurt',1,4,None,23),
  ('sword-knight','BladeKnight',1,13,None,32),('waddle-doo','WaddleDoo',1,11,None,26),('wheelie','Wheelie',1,3,None,27),
  ('scarfy','Scarfy',1,6,None,25),('kracko-jr','KrackoJr',1,1,None,32),('bonkers','Bonkers',1,8,None,46),
  ('dedede','KingDedede',8,7,list(range(36)),48),
  ('nightmare-orb','NightmareOrb',1,4,None,56),('nightmare','NightmareWizard_NotForShader',1,25,list(range(14)),80),
  ('whispy','Whispy',1,4,None,136),('kracko','Kracko',1,2,None,66),
]:
    name='enhanced-'+file+'.png';frames=grid(name,cols,rows,indices)
    if key=='kracko':
        eye=load('KrackoEyeBase.png');pupil=load('KrackoEyePupil.png')
        for f in frames:
            f.alpha_composite(eye,((f.width-eye.width)//2,(f.height-eye.height)//2))
            f.alpha_composite(pupil,((f.width-pupil.width)//2,(f.height-pupil.height)//2))
    clips = {'bonkers':{'idle':[0],'move_forward':[1,2],'move_back':[1,2],'basic_windup':[3],
        'basic_resolve':[4],'skill_or_secondary':[5,6,7],'ultimate_entry':[3,4]},
      'dedede':{'idle':[0,1,2],'move_forward':[3,4,5,6,7],'move_back':[7,6,5,4,3],
        'basic_windup':[19,20],'basic_resolve':[21,22],'skill_or_secondary':[23,24,25,26,27,28,29],
        'hurt':[35],'knockout':[35],'ultimate_entry':[33,34,8,9,10,31,32]},
      'whispy':{'idle':[0,1],'basic_windup':[2],'basic_resolve':[2,3],'skill_or_secondary':[2,3],
        'move_forward':[0],'move_back':[0]}}.get(key,{})
    export(key,frames,[name]+(['KrackoEyeBase.png','KrackoEyePupil.png'] if key=='kracko' else []), clips=clips,
      height=height,cell=(160,160) if key in ['whispy','nightmare'] else (96,96) if key in ['dedede','bonkers','kracko','nightmare-orb'] else (64,64),
      notes='Enhanced private-prototype treatment from Happiiz/KirboMod; original/custom sprite authorship must be reviewed before distribution. Boss/fighter scaling is declared separately.')

# NES profiles from the labeled enemy sheet; palette retained as an enhanced treatment.
export('hot-head',palette(rects('kirby-enemies.png',[(94+i*20,119,18,18) for i in range(3)]),{(252,110,204):(232,104,56),(252,254,252):(252,216,144)}),'kirby-enemies.png',height=27,notes='Native NES palette-indexed source. Fire palette is a declared reconstruction; flame contacts are simulation markers.')
export('sparky',animated('rankset-sparky.gif'),'rankset-sparky.gif',height=26,notes='Source animated rank-set sprite. Palette/source-game verification remains pending; explicit enhanced treatment.')
export('rocky',palette(rects('kirby-enemies.png',[(94+i*20,239,18,18) for i in range(3)]),{(252,110,204):(108,116,132),(252,254,252):(196,204,216)}),'kirby-enemies.png',height=26,notes='Native NES palette-indexed stone body with a declared gray reconstruction. Timed invulnerability and drop motion are authoritative.')
export('laser-ball',palette(rects('kirby-enemies.png',[(94+i*20,99,18,18) for i in range(3)]),{(252,110,204):(232,148,72),(252,254,252):(252,232,164)}),'kirby-enemies.png',height=25,notes='Native NES source with a declared orange/gold palette reconstruction.')
export('paint-roller',animated('rankset-paintroller.gif'),'rankset-paintroller.gif',height=42,notes='Source animated skating/painting sprite. Paint and summons are independent contact effects; enhanced treatment.')
export('star-rod',grid('StarRod.png',1,1),'StarRod.png',height=30,notes='Encounter-loan prop. Not a collectible Power-Up or a character.')
export('knuckle-joe',animated('rankset-knucklejoe.gif'),'rankset-knucklejoe.gif',height=34,
  clips={'idle':[0],'move_forward':[0,1],'basic_windup':[2],'basic_resolve':[2,3,4,5],'skill_or_secondary':[4,5],'ultimate_entry':[2,3,4,5]},
  notes='Source punch poses from the animated rank set; planted contact rhythm and uppercut are marker-driven. Enhanced treatment.')
export('bio-spark',animated('rankset-biospark.gif'),'rankset-biospark.gif',height=32,
  clips={'idle':[0],'move_forward':[0,1,2],'basic_windup':[3],'basic_resolve':[3,4],'skill_or_secondary':[4,5],'ultimate_entry':[3,4,5]},
  notes='Source ninja poses; tell, vanish duration, exit puff and crossing contact are separate simulation states. Enhanced treatment.')

# Real source body poses: idle 0–1, walk 2–7, jab 8–10, jump 11,
# ready/throw 12–13. The source game renders its held spear separately.
frames=grid('enhanced-bandana.png',1,14)
spear=load('enhanced-spear-held.png').rotate(-45,resample=Image.Resampling.NEAREST,expand=True)
spear=spear.crop(spear.getbbox());spear=spear.resize((48,8),Image.Resampling.NEAREST)
for i in [8,9,10]:
    body=frames[i];canvas=Image.new('RGBA',(96,64));canvas.alpha_composite(body)
    canvas.alpha_composite(spear,(42+(i-8)*3,34));frames[i]=canvas
export('bandana',frames,['enhanced-bandana.png','enhanced-spear-held.png'],height=34,cell=(96,96),
    clips={'idle':[0,1],'move_forward':[2,3,4,5,6,7],'move_back':[7,6,5,4,3,2],
      'basic_windup':[8],'basic_resolve':[8,9,10],'skill_or_secondary':[12,13],
      'hurt':[11],'knockout':[13],'ultimate_entry':[11,12,13]},
    notes='Source Bandana walk, jab, jump and throw poses from Happiiz/KirboMod. Held spear attached to source jab poses; copter path and ultimate marker motion remain provisional. Original-game/custom artist review pending.')
export('bandana-spear',grid('enhanced-spear-thrown.png',1,1),'enhanced-spear-thrown.png',height=8,
    notes='Source horizontal spear projectile; persistent flight is resolved by combat, separate from the fighter body.')

export('meta-knight',animated('rankset-metaknight.gif'),'rankset-metaknight.gif',height=40,
    clips={'idle':[0,1],'move_forward':[0,1,2,3],'move_back':[3,2,1,0],'basic_windup':[0],
      'basic_resolve':[2,3],'skill_or_secondary':[1,2],'ultimate_entry':[0,1,2,3]},
    notes='PROVISIONAL source flying treatment; four wing poses, carried sword, authored counter/duel/tornado motion. Original-game/authorship review remains pending; no final NES claim.')

(OUT/'manifest.json').write_text(json.dumps(definitions,indent=2)+'\n')
(OUT/'manifest.mjs').write_text('export default '+json.dumps(definitions,separators=(',',':'))+';\n')
contact=Image.new('RGB',(960,((len(definitions)+7)//8)*150),'#e9e1cc');d=ImageDraw.Draw(contact)
for i,(key,record) in enumerate(definitions.items()):
    icon=Image.open(OUT/(key+'-icon.png'));icon.thumbnail((105,105),Image.Resampling.NEAREST)
    x=i%8*120;y=i//8*150;contact.paste(icon,(x,y+20),icon);d.text((x+3,y+125),key[:18],fill='#2b261e')
contact.save(OUT/'contact-sheet.png')
scenes=ROOT/'assets/scenes';scenes.mkdir(exist_ok=True)
scene_sheet=load('kirby-background.png')
for name,box in [('ka-valley',(0,0,1018,171)),('ka-tower',(0,171,1018,342)),('ka-water',(0,342,1018,511))]:scene_sheet.crop(box).save(scenes/(name+'.png'))
print(f'Imported {len(definitions)} atlases. Manifest and contact sheet saved to {OUT}.')
