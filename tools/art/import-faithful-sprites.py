"""Import reviewed game-specific sheets without resizing individual poses.

Run after import-v1-sprites.py to retain the separately sourced equipment art.
Python development dependencies: Pillow, numpy, scipy. No runtime dependency.
Coordinates are reviewed source pixels; detached weapons remain in their cells.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib, json, math, runpy

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets/sprites/v1'
review = runpy.run_path(str(Path(__file__).with_name('catalog-faithful-sheets.py')))
clean, spans, ROWS = review['clean'], review['spans'], review['ROWS']
intake = {r['name']: r for r in json.loads((ROOT/'assets/sprites/sources/faithful/INTAKE.json').read_text())}
manifest = json.loads((OUT/'manifest.json').read_text())
SMB, KA, GB, SS, RTDL = 'super-mario-bros-1985', 'kirbys-adventure-1993', 'kirbys-dream-land-1992', 'kirby-super-star-1996', 'kirbys-return-to-dream-land-2011'
updated = []

def frames(source, boxes):
    return [(clean(source).crop(tuple(box)), list(box)) for box in boxes]

def layered(source, layers, canvas=(32,32)):
    im=Image.new('RGBA',canvas)
    for layer in layers:
        im.alpha_composite(clean(source).crop(layer['rect']),tuple(layer['at']))
    return (im,{'sourceCanvas':list(canvas),'sourceLayers':layers})

def row(source, label, indices=None):
    boxes = sorted(spans(source, ROWS[source][label]), key=lambda b:b[0])
    return frames(source, boxes if indices is None else [boxes[i] for i in indices])

def band(source, box, indices=None):
    boxes = sorted(spans(source, box), key=lambda b:b[0])
    return frames(source, boxes if indices is None else [boxes[i] for i in indices])

def palette(sequence, colors):
    result=[]
    for im, box in sequence:
        im=im.copy();im.putdata([(*colors.get((r,g,b),(r,g,b)),a)for r,g,b,a in im.get_flattened_data()])
        result.append((im,box))
    return result

def anchor(im, foot_colors=None):
    """Use the feet, so a spear tip or detached hammer cannot move the body."""
    box=im.getbbox()
    if not box:raise ValueError('Empty source frame')
    if foot_colors:
        points=[(x,y)for y in range(im.height)for x in range(im.width)if im.getpixel((x,y))[:3] in foot_colors and im.getpixel((x,y))[3]]
        if points:
            bottom=max(y for x,y in points)
            feet=[x for x,y in points if y>=bottom-2]
            return ((min(feet)+max(feet)+1)/2,min(box[3],bottom+2))
    # In ordinary body cells the lowest three opaque rows are the feet.
    points=[x for y in range(max(box[1],box[3]-3),box[3])for x in range(box[0],box[2])if im.getpixel((x,y))[3]]
    return ((min(points)+max(points)+1)/2,box[3])

def export(key, source, game, clips, body=16, world=24, facing='right', feet=None, notes='', adaptation=False, sparse=False):
    defaults={'idle':next(iter(clips.values()))[:1]}
    defaults.update(clips)
    for label in ['move_forward','move_back','basic_windup','basic_resolve','skill_or_secondary','hurt','knockout','ultimate_entry']:
        defaults.setdefault(label, defaults['basic_resolve'] if label in ['skill_or_secondary','ultimate_entry'] and 'basic_resolve' in defaults else defaults['idle'])
    unique=[];lookup={};clip_indices={}
    for label, sequence in defaults.items():
        if not sequence:raise ValueError(f'Empty clip: {key}/{label}')
        indices=[]
        for im, box in sequence:
            stamp=hashlib.sha256(im.tobytes()).hexdigest()
            if stamp not in lookup:
                lookup[stamp]=len(unique);unique.append((im,box,anchor(im,feet)))
            indices.append(lookup[stamp])
        clip_indices[label]=indices
    extent=max(max(p[0],im.width-p[0])for im,b,p in unique)
    cw=max(64,math.ceil((extent*2+8)/8)*8)
    top=max(p[1]for im,b,p in unique);bottom=max(im.height-p[1]for im,b,p in unique)
    ch=max(64,math.ceil((top+bottom+8)/8)*8)
    pivot=[cw/2,top+4];cols=min(8,len(unique));atlas=Image.new('RGBA',(cw*cols,ch*math.ceil(len(unique)/cols)))
    coordinates=[];metadata=[]
    for i,(im,b,p)in enumerate(unique):
        x=round(pivot[0]-p[0]);y=round(pivot[1]-p[1])
        if y<0 or x<0 or x+im.width>cw or y+im.height>ch:raise ValueError(f'Clipped frame: {key}/{i}')
        atlas.alpha_composite(im,(i%cols*cw+x,i//cols*ch+y))
        coordinates.append([i%cols*cw,i//cols*ch,cw,ch]);metadata.append({**(b if isinstance(b,dict) else {'sourceRect':b}),'sourceFoot':list(p),'pixelScale':1})
    path=OUT/(key+'.png');atlas.save(path)
    credits={'smb-mario-luigi':'Superjustinbros / Nintendo','smb-enemies':'Superjustinbros / Nintendo','smb-npcs-items':'Superjustinbros / Nintendo',
      'gb-kirby':'Sonikku, thejohnston7 / HAL Laboratory','ka-meta-knight':'someguy, Jermungandr / HAL Laboratory',
      'ka-kirby':'Drshnaps (Jermungandr), QuadFactor, UltraHype97 / HAL Laboratory','bandana-adaptation':'gameboy09 / HAL Laboratory character'}
    manifest[key]={'url':f'assets/sprites/v1/{key}.png','frames':coordinates,'clips':clip_indices,'fps':10,
      'clipFps':{'idle':4,'basic_resolve':14,'skill_or_secondary':12,'ultimate_entry':12},
      'loopClips':['idle','move_forward','move_back']+(['skill_or_secondary']if key=='bandana' else ['ultimate_entry']if key=='meta-knight'else []),
      'cell':[cw,ch],'pivot':pivot,'labelHeight':max(body,unique[0][2][1]-unique[0][0].getbbox()[1]),'nativeHeight':body,'worldHeight':world,'facing':facing,
      'sourceFiles':[intake[source]['path']],'sourcePage':intake[source]['page'],'sourceGameId':game,
      'credit':credits.get(source,'Drshnaps (Jermungandr) / HAL Laboratory'),
      'spriteGrade':'B'if sparse else 'A','status':'native-sparse'if sparse else 'reviewed-adaptation'if adaptation else 'reviewed-native',
      'renderMode':'faithful-2d-adaptation'if adaptation else 'native-sprite','frameMetadata':metadata,
      'notes':notes,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
    first=unique[0][0];first=first.crop(first.getbbox());ratio=min(104/first.width,104/first.height)
    first=first.resize((max(1,round(first.width*ratio)),max(1,round(first.height*ratio))),Image.Resampling.NEAREST)
    icon=Image.new('RGBA',(128,128));icon.alpha_composite(first,((128-first.width)//2,120-first.height));icon.save(OUT/(key+'-icon.png'))
    if key not in updated:updated.append(key)

for key,label,world in [('mario','mario',48),('luigi','luigi',52)]:
    f=row('smb-mario-luigi',label)
    export(key,'smb-mario-luigi',SMB,{'idle':f[:1],'move_forward':f[1:4],'move_back':f[1:4],
      'basic_windup':f[:1],'basic_resolve':f[5:6],'skill_or_secondary':f[5:6],'jump':f[5:6],'hurt':f[4:5],'knockout':f[4:5],'ultimate_entry':f[5:6]},
      body=32,world=world,notes='Original Super Mario Bros. large-form poses and palette. Fixed source-pixel scale throughout the jump.')

# Original rescue NPCs have one pose each, not invented walk/attack animations.
for key,box,world in [('toad',[0,444,16,468],32),('peach',[18,444,34,468],44)]:
    export(key,'smb-npcs-items',SMB,{'idle':frames('smb-npcs-items',[box])},body=24,world=world,facing='left'if key=='peach'else 'right',sparse=True,
      notes='Original 1985 rescue NPC. Single native body pose; float, recoil and delivery motion are procedural. Expanded faithful animation still needed for Peach.')

enemy_boxes={
 'goomba':[[0,17,16,33],[18,17,34,33],[36,17,52,33]],
 'buzzy':[[0,35,16,51],[18,35,34,51]],'blooper':[[0,53,16,77],[18,53,34,77]],
 'bullet':[[54,53,70,69]],'koopa':[[0,112,16,136],[18,112,34,136],[72,120,88,136],[90,120,106,136]],
 'piranha':[[0,138,16,162],[18,138,34,162]],'lakitu':[[54,138,70,162],[72,146,88,162]],
 'hammer-bro':[[36,178,52,202],[54,178,70,202],[72,178,88,202],[90,178,106,202]],
 'bowser':[[0,208,32,240],[34,208,66,240],[68,208,100,240],[102,208,134,240]],
 'cheep':[[0,370,16,386],[18,370,34,386]],'spiny':[[72,352,88,368],[90,352,106,368]],
 'podoboo':[[90,370,106,386]],
}
for key,boxes in enemy_boxes.items():
    f=frames('smb-enemies',boxes);height=32 if key=='bowser' else 24 if key in ['koopa','hammer-bro','piranha','lakitu','blooper'] else 16
    clips={'idle':f[:2],'move_forward':f[:2],'move_back':f[:2],'basic_windup':f[:1],'basic_resolve':f[2:]or f,'skill_or_secondary':f[2:]or f,'hurt':f[:1],'knockout':f[-1:],'ultimate_entry':f}
    if key=='koopa':clips['skill_or_secondary']=f[2:];clips['knockout']=f[2:3];clips['ultimate_entry']=f[2:3]
    export(key,'smb-enemies',SMB,clips,body=height,world={'bowser':64,'koopa':36,'hammer-bro':36,'piranha':38,'lakitu':38,'blooper':32}.get(key,24),facing='left',
      sparse=True,notes='Original 1985 enemy body and palette. Sparse native pose set; actions use simulation-timed movement and source projectiles.')

# Captain/FungiCaptain extends the original boar-like SMB1 body itself,
# rather than substituting a later Bowser design rendered in NES style.
bowser=frames('smb-bowser-180958',[[i*33,10,i*33+32,42]for i in range(17)])
export('bowser','smb-bowser-180958',SMB,{'idle':bowser[:1],'move_forward':bowser[5:7],'move_back':bowser[5:7],
 'basic_windup':bowser[:1],'basic_resolve':bowser[5:7],'skill_or_secondary':bowser[16:17],
 'ultimate_entry':bowser[16:17],'jump':bowser[8:9],'hurt':bowser[7:8],'knockout':bowser[15:16]},
 body=32,world=64,facing='right',adaptation=True,notes='Captain / FungiCaptain expansion of the actual 1985 boar-like Bowser body: native-design walk, crouch/spin, skid, jump, swimming, fire and defeat. Chosen over later-design NES-style sheets. Claw/flame interactions still use authored contact effects.')
manifest['bowser']['credit']='Captain (FungiCaptain) / Nintendo original sprite'

# Use the classic 24-pixel body row, not the smaller ROM-hack body or the
# Fire/SMB2 variants on the same sheet. The original costume stays intact.
hammer_idle=frames('smb-hammer-expanded',[[280,99,296,124]])
hammer_walk=frames('smb-hammer-expanded',[[354,98,369,123],[387,101,403,124],[420,100,435,124]])
hammer_throw=frames('smb-hammer-expanded',[[145,94,160,124],[178,94,193,124],[210,94,225,124],[243,94,258,124]])
hammer_jump=frames('smb-hammer-expanded',[[12,133,28,165],[45,133,61,165]])
export('hammer-bro','smb-hammer-expanded',SMB,{'idle':hammer_idle,'move_forward':hammer_walk,'move_back':hammer_walk,
 'basic_windup':hammer_throw[:1],'basic_resolve':hammer_throw,'skill_or_secondary':hammer_throw,
 'ultimate_entry':hammer_throw,'jump':hammer_jump,'hurt':frames('smb-hammer-expanded',[[458,99,472,124]]),
 'knockout':frames('smb-hammer-expanded',[[353,140,371,162]])},body=24,world=36,facing='left',adaptation=True,
 notes='PixelatedPete expansion of the original 24-pixel SMB1 Hammer Bro. Classic green/white costume, native-pixel walk, throw, jump, skid and defeat; smaller ROM-hack and later-game variants excluded.')
manifest['hammer-bro']['credit']='PixelatedPete (PlugItIn&Pete); Superjustinbros original rip / Nintendo'

buzzy_walk=frames('smb-buzzy-expanded',[[3,13,22,28],[25,12,44,28],[47,11,66,28],[69,12,88,28]])
buzzy_shell=frames('smb-buzzy-expanded',[[4,38,20,52],[23,38,39,52],[42,38,60,52],[63,38,80,52]])
export('buzzy','smb-buzzy-expanded',SMB,{'idle':buzzy_walk[:1],'move_forward':buzzy_walk,'move_back':buzzy_walk,
 'basic_windup':buzzy_walk[:1],'basic_resolve':buzzy_shell,'skill_or_secondary':buzzy_shell,'ultimate_entry':buzzy_shell,
 'jump':buzzy_shell,'hurt':buzzy_walk[1:2],'knockout':buzzy_shell[:1]},body=16,world=24,facing='left',adaptation=True,
 notes='Side Steppa expansion of the original SMB1 black/brown body. Exact native brown/peach palette, four walking and four rolling frames. Winged later-game variants excluded.')
manifest['buzzy']['credit']='Side Steppa / Nintendo original character'
manifest['buzzy']['loopClips']+=['basic_resolve','ultimate_entry']

# The classic row supplies the green goggles/round head, not the later orange
# designs lower on this sheet. Cloud and rider retain one pixel scale. Assemble
# in a fixed 32px cell; the cloud's base is the shared anatomical anchor.
lakitu_source='smb-lakitu-expanded'
head=[3,9,17,27];duck=[37,17,51,31];look=[54,9,68,27]
panic=[79,10,94,27];recoil=[179,10,194,27]
clouds=[[214,19,230,35],[297,19,313,35],[314,19,330,35],[331,19,347,35]]
def cloud_rider(body,cloud=0,drop=0):
    return layered(lakitu_source,[{'rect':body,'at':[9,drop]},{'rect':clouds[cloud],'at':[8,12]}])
lakitu_idle=[cloud_rider(head),cloud_rider(head,1)]
lakitu_throw=[cloud_rider(head),cloud_rider(duck,0,4),cloud_rider(duck,1,4),cloud_rider(look)]
export('lakitu',lakitu_source,SMB,{'idle':lakitu_idle,'move_forward':lakitu_idle,'move_back':lakitu_idle,
 'basic_windup':lakitu_throw[:2],'basic_resolve':lakitu_throw,'skill_or_secondary':lakitu_throw,'ultimate_entry':lakitu_throw,
 'hurt':[cloud_rider(panic,2)],'knockout':[cloud_rider(recoil,3)]},body=28,world=38,facing='left',adaptation=True,
 notes='yiey20 expansion of the original green-goggled SMB1 rider and small cloud. Classic row only, mapped to the retained NES rip palette; cloud/rider assembly is authored. Fixed cloud anchor, throw preparation/release and distinct recoil poses. Later costumes and large clouds excluded.')
manifest['lakitu']['credit']='yiey20 / Nintendo original character'

pinkfeet={(252,130,116)}
idle=row('ka-kirby','idle',[0,1]);walk=row('ka-kirby','walk');inhale=row('ka-kirby','inhale',[0,1,2,3,4,5,6,7,8,9]);puff=row('ka-kirby','puff',[0,1,2,3,4,5,6,7])
hurt=band('ka-kirby',[4,232,110,261],[0,1,2]);star=frames('ka-kirby',[[26,519,50,545],[54,519,78,545]])
export('kirby','ka-kirby',KA,{'idle':idle,'move_forward':walk,'move_back':walk,'basic_windup':inhale[:3],
  'basic_resolve':inhale[3:8],'skill_or_secondary':inhale,'hurt':hurt,'knockout':hurt[-1:],'jump':puff,'ultimate_entry':star},feet=pinkfeet,
  notes='Original Adventure pink neutral body, inhale, puff and Warp Star. Copy forms retain the original game palettes and equipment.')
gb_idle=row('gb-kirby','idle',[0]);gb_walk=row('gb-kirby','walk');gb_inhale=row('gb-kirby','inhale');gb_puff=row('gb-kirby','puff');gb_hurt=row('gb-kirby','hurt')
export('kirby-dream-land','gb-kirby',GB,{'idle':gb_idle,'move_forward':gb_walk,'move_back':gb_walk,'basic_windup':gb_idle,
  'basic_resolve':gb_puff[2:5],'skill_or_secondary':gb_inhale,'jump':gb_puff,'hurt':gb_hurt,'knockout':gb_hurt[-1:],'ultimate_entry':gb_inhale},
  notes='Distinct original Game Boy sheet, including native grayscale pixels. This is not recolored Adventure Kirby.')

# NES Copy abilities share a native neutral silhouette. Equipment/action poses
# are distinct; Adventure has no modern Fire/Spark hats to add to that silhouette.
neutral=row('ka-kirby','copy-neutral',[0,1]);copywalk=palette(walk,{(252,194,228):(252,202,196),(252,110,204):(252,130,116)});beam=frames('ka-kirby',[[6,765,22,781],[26,765,42,781]])
sword_walk=row('ka-kirby','sword-walk');sword_swing=frames('ka-kirby',[[6+i*43,1280,46+i*43,1324]for i in range(8)])
hammer_walk=row('ka-kirby','hammer-walk');hammer_swing=frames('ka-kirby',[[4+i*42,2007,44+i*42,2048]for i in range(7)])
cutter=neutral
copy_actions={'fire':row('ka-kirby','fire',[0]),'spark':frames('ka-kirby',[[246,820,262,836]]),'ice':row('ka-kirby','ice',[0]),'beam':beam,
 'cutter':cutter,'sword':sword_swing,'hammer':hammer_swing}
for key,attack in copy_actions.items():
    move=sword_walk if key=='sword' else hammer_walk if key=='hammer' else copywalk
    rest=move[:1]if key in ['sword','hammer']else neutral
    sk=row('ka-kirby','fireball',[2,3,4,5,6,7,8,9])if key=='fire'else attack
    clips={'idle':rest,'move_forward':move,'move_back':move,'basic_windup':rest,'basic_resolve':attack,'skill_or_secondary':sk,'jump':move[:4],'hurt':hurt,'ultimate_entry':attack}
    feet=pinkfeet
    if key=='ice':
        # Exact Ice/Freeze palette chips on the source sheet (white, blue, black).
        mapping={(252,202,196):(252,254,252),(252,130,116):(20,18,164)}
        clips={k:palette(v,mapping)for k,v in clips.items()};feet={(20,18,164)}
    export('kirby-'+key,'ka-kirby',KA,clips,feet=feet,notes='Original NES '+key+' action and equipment cells; body pixels keep a fixed size. Ice uses the source sheet Ice palette.')

rod_walk=frames('ka-kirby',[[5,2524,25,2552],[33,2524,66,2552],[76,2524,98,2552],[113,2524,133,2552]])
rod_swing=frames('ka-kirby',[[5+i*43,2464,46+i*43,2510]for i in range(8)])
export('kirby-star-rod','ka-kirby',KA,{'idle':rod_walk[:1],'move_forward':rod_walk,'move_back':rod_walk,'basic_windup':rod_walk[:1],'basic_resolve':rod_swing,'skill_or_secondary':rod_swing,'ultimate_entry':star,'hurt':hurt},feet=pinkfeet,notes='Native Star Rod wielding body and swing cells, reserved for the Nightmare encounter loan.')

profiles={'waddle-dee':('waddle',24),'parasol':('parasol',24),'waddle-doo':('doo',24),'sparky':('sparky',26),'hot-head':('hot-head',26),
 'laser-ball':('laser',24),'chilly':('chilly',27),'sir-kibble':('kibble',26),'rocky':('rocky',24),'wheelie':('wheelie',26),
 'sword-knight':('sword',28),'blade-knight':('blade',28),'bronto':('bronto',22),'scarfy':('scarfy',24),'kabu':('kabu',32)}
for key,(label,world)in profiles.items():
    f=row('ka-enemies',label)
    if key=='parasol':f=frames('ka-enemies',[[114,23,134,59],[134,23,154,59]])
    if key in ['parasol','hot-head','sir-kibble','laser-ball']:f=f[:3 if key!='laser-ball'else 2]
    if key=='waddle-doo':f=[f[0],f[2]]
    if key=='sword-knight':f=frames('ka-enemies',[[94,432,116,460],[116,432,140,460],[140,432,164,460],[164,432,190,460],[190,432,216,460]])
    if key=='blade-knight':f=frames('ka-enemies',[[94,532,116,557],[116,532,140,557],[140,532,164,557],[164,532,190,557],[190,532,216,557]])
    export(key,'ka-enemies',KA,{'idle':f[:1],'move_forward':f[:2],'move_back':f[:2],'basic_windup':f[:1],
      'basic_resolve':f[1:]or f,'skill_or_secondary':f[1:]or f,'hurt':f[:1],'knockout':f[-1:],'ultimate_entry':f},
      body=16,world=world,facing='left',notes='Original Adventure body cells and sheet palette. Sword Knight and Blade Knight are separate sources, not a shared sprite.')
    if key in ['wheelie','waddle-dee']:manifest[key]['loopClips']+=['basic_resolve','skill_or_secondary','ultimate_entry']
# Keep the original whole-body idle; articulate the same native umbrella and
# body pixels for the playable poke/spin instead of swapping in a later Dee.
parasol_body=frames('ka-enemies',[[114,41,134,59],[134,41,154,59]])
export('parasol-body','ka-enemies',KA,{'idle':parasol_body[:1],'move_forward':parasol_body,'basic_resolve':parasol_body,
 'ultimate_entry':parasol_body},body=16,world=24,facing='left',sparse=True,
 notes='Native 1993 Parasol Waddle Dee body, separated from its own umbrella only for articulated playable attacks.')
export('ka-parasol','ka-enemies',KA,{'idle':frames('ka-enemies',[[114,23,134,41],[134,23,154,41]])},body=18,world=27,
 notes='Native 1993 umbrella cells from Parasol Waddle Dee. Handle pivot supports authored poke/spin motion without changing the source pixels.')
manifest['parasol']['parts']={'body':'parasol-body','weapon':'ka-parasol'}
manifest['parasol']['status']='layered-native'
manifest['parasol']['notes']+=' Playable poke/spin articulate the original body and umbrella as separate layers; those extra motions are authored, not ripped frames.'
poppy=band('ka-enemies',[94,757,173,778]);poppy_throw=band('ka-enemies',[94,784,174,805],[0,2])
export('poppy','ka-enemies',KA,{'idle':poppy[:1],'move_forward':poppy,'basic_resolve':poppy_throw,'skill_or_secondary':poppy_throw,'ultimate_entry':poppy_throw},world=26,facing='left')

dedede_idle=row('ka-dedede','idle');dedede_inhale=frames('ka-dedede',[[29,460,60,490],[63,460,98,490],[121,460,152,490],[185,460,216,490]])
dedede_hammer=frames('ka-dedede',[[29+i*64,546,89+i*64,608]for i in range(7)])
# Hammer pixels occupy separate cells; the king's body stands at x=32 in each.
dedede_fixed=[]
for im,box in dedede_hammer:
    # Keep full weapon cell; a body-only red/white lower-center region supplies
    # a stable foot anchor even when the detached hammer reaches the ground.
    dedede_fixed.append((im,box))
export('dedede','ka-dedede',KA,{'idle':dedede_idle,'move_forward':dedede_idle,'move_back':dedede_idle,
 'basic_windup':dedede_hammer[:3],'basic_resolve':dedede_hammer[3:],'skill_or_secondary':dedede_inhale,
 'jump':row('ka-dedede','jump',[0,1,3]),'ultimate_entry':row('ka-dedede','jump',[0,1,3]),'hurt':row('ka-dedede','hurt',[0]),'knockout':row('ka-dedede','hurt',[-1])},
 body=32,world=54,facing='left',feet={(180,50,36)},notes='Original Adventure king: native hammer sweep, inhale and hammer-jump. Detached hammer is preserved at the same pixel scale as his body.')
meta_idle=row('ka-meta-knight','walk',[0]);meta_walk=row('ka-meta-knight','walk');meta_counter=row('ka-meta-knight','counter')
meta_swing=frames('ka-meta-knight',[[9,569,34,608],[34,569,61,608],[61,569,85,608],[85,569,116,608],[116,569,145,608],[145,569,185,608]])
meta_spin=frames('ka-meta-knight',[[6,428,36,465],[36,428,64,465],[64,428,90,465],[90,428,116,465],[116,428,145,465],[145,428,170,465],[170,428,195,465],[195,428,222,465]])
meta_clips={'idle':meta_idle,'move_forward':meta_walk,'move_back':meta_walk,'basic_windup':meta_idle,
 'basic_resolve':meta_swing,'skill_or_secondary':meta_counter,'counter_exit':meta_counter,'counter_entry':meta_swing,'jump':row('ka-meta-knight','jump',[0,1,2,3]),'ultimate_entry':meta_spin,'finisher':meta_swing,
 'hurt':meta_counter[-1:],'knockout':meta_idle}
meta_palette={(219,0,205):(152,120,248),(240,208,176):(248,248,248)}
meta_clips={key:palette(value,meta_palette)for key,value in meta_clips.items()}
export('meta-knight','ka-meta-knight',KA,meta_clips,body=16,world=28,facing='left',feet={(152,120,248)},
 notes='Original Adventure LEVEL6 blue duel palette, with actual walk, sword sweep, guard and spin cells; no later-game wing-loop substitution.')

manifest['meta-knight']['paletteMapping']={','.join(map(str,k)):list(v)for k,v in meta_palette.items()}
manifest['meta-knight']['paletteSource']='Original sheet LEVEL6 palette; weapon palette retained.'

joe_idle=row('ss-knuckle-joe','idle');joe_walk=row('ss-knuckle-joe','walk');jab=row('ss-knuckle-joe','jab');upper=row('ss-knuckle-joe','uppercut',[0,2,3,5])
export('knuckle-joe','ss-knuckle-joe',SS,{'idle':joe_idle,'move_forward':joe_walk,'move_back':joe_walk,'basic_windup':jab[:1],
 'basic_resolve':jab,'skill_or_secondary':upper,'jump':row('ss-knuckle-joe','jump'),'ultimate_entry':row('ss-knuckle-joe','smash',[0,1,2,3,4]),
 'hurt':row('ss-knuckle-joe','hurt',[0,1,2,3,4,5]),'knockout':row('ss-knuckle-joe','hurt',[5])},body=32,world=28,
 notes='Original 1996 Super Star helper, including actual jabs, uppercut and Smash Punch. Loose blue hit arcs are not used as body frames.')
bio_idle=row('ss-bio-spark','idle');bio_walk=row('ss-bio-spark','walk');bio_knife=row('ss-bio-spark','knife')
export('bio-spark','ss-bio-spark',SS,{'idle':bio_idle,'move_forward':bio_walk,'move_back':bio_walk,'basic_windup':bio_knife[:1],
 'basic_resolve':bio_knife,'skill_or_secondary':row('ss-bio-spark','dash'),'ultimate_entry':bio_knife,'hurt':row('ss-bio-spark','hurt'),
 'knockout':row('ss-bio-spark','hurt',[-1])},body=28,world=28,notes='Original 1996 Super Star ninja helper, knife throw, dash slash and native damage poses.')

bandana_idle=row('bandana-adaptation','idle');bandana_walk=row('bandana-adaptation','walk');bandana_thrust=row('bandana-adaptation','thrust')
export('bandana','bandana-adaptation',RTDL,{'idle':bandana_idle,'move_forward':bandana_walk,'move_back':bandana_walk,
 'basic_windup':bandana_idle[:1],'basic_resolve':bandana_thrust,'skill_or_secondary':row('bandana-adaptation','copter'),
 'jump':row('bandana-adaptation','copter'),'landing':row('bandana-adaptation','copter-exit'),
 'ultimate_entry':row('bandana-adaptation','throw'),'hurt':row('bandana-adaptation','hurt',[0,1,2]),'knockout':row('bandana-adaptation','hurt',[-1])},
 body=24,world=26,feet={(240,200,152),(224,152,112)},adaptation=True,
 notes='gameboy09 complete spear adaptation in Super Star Ultra pixel style. Modern spear thrust, throw and Waddle Copter faithfully support the Return to Dream Land kit. Source Wii model was compared but contains no animation tracks.')

bonkers_idle=row('ka-midbosses','bonkers-idle',[0,1,2,3]);bonkers_swing=frames('ka-midbosses',[[8,750,42,798],[48,750,82,798],[88,750,124,798],[128,750,162,798],[168,750,205,798],[207,750,250,798],[251,750,291,798]])
export('bonkers','ka-midbosses',KA,{'idle':bonkers_idle[:1],'move_forward':bonkers_idle,'basic_windup':bonkers_swing[:3],
 'basic_resolve':bonkers_swing[3:],'skill_or_secondary':bonkers_swing,'ultimate_entry':bonkers_swing,'hurt':bonkers_idle[-1:]},body=32,world=44,facing='left',feet={(252,130,116)})

paint_idle=frames('ka-paint-roller',[[263,4,292,36],[297,4,326,36],[331,4,360,36]])
paint_walk=frames('ka-paint-roller',[[263,78,292,110],[303,78,332,110],[337,78,366,110],[371,78,400,110]])
paint_cast=frames('ka-paint-roller',[[263,40,292,72],[297,40,326,72],[331,40,360,72],[371,40,400,72]])
export('paint-roller','ka-paint-roller',KA,{'idle':paint_idle[:1],'move_forward':paint_walk,'move_back':paint_walk,
 'basic_resolve':paint_cast,'skill_or_secondary':paint_cast,'hurt':paint_idle[-1:],'knockout':paint_idle[-1:]},body=32,world=40,facing='left')

# Kracko's original body and eye are separate NES objects; assemble their cells.
cloud=[];junior=[]
for i in range(3):
    im=clean('ka-kracko').crop((514+i*52,266,562+i*52,314));im.alpha_composite(clean('ka-kracko').crop((514+(i%2)*20,318,530+(i%2)*20,334)),(16,16));cloud.append((im,[514+i*52,266,562+i*52,314]))
for i in range(4):
    im=clean('ka-kracko').crop((514+i*38,188,548+i*38,222));im.alpha_composite(clean('ka-kracko').crop((514+(i%2)*20,226,530+(i%2)*20,242)),(9,9));junior.append((im,[514+i*38,188,548+i*38,222]))
export('kracko','ka-kracko',KA,{'idle':cloud,'basic_resolve':cloud,'skill_or_secondary':cloud},body=48,world=72,facing='left',notes='Native cloud cells with the separately ripped eye composited into the original 16×16 eye socket.')
export('kracko-jr','ka-kracko',KA,{'idle':junior,'basic_resolve':junior},body=34,world=42,facing='left')

orb=frames('ka-orb',[[271+i*44,114+j*34,303+i*44,146+j*34]for j in range(4)for i in range(1)])
export('nightmare-orb','ka-orb',KA,{'idle':orb,'basic_resolve':orb,'skill_or_secondary':orb},body=32,world=56,facing='left')
night=[]
for box in [[4,166,79,271],[81,166,158,271],[160,166,237,271],[239,166,316,271]]:
    im=clean('ka-nightmare').crop(tuple(box));im.putdata([(r,g,b,0 if (r,g,b)in [(0,0,0),(4,2,4)]else a)for r,g,b,a in im.get_flattened_data()]);night.append((im,box))
export('nightmare','ka-nightmare',KA,{'idle':night,'basic_resolve':night,'skill_or_secondary':night,'ultimate_entry':night},body=96,world=100,facing='left',notes='Original Nightmare wizard full-body cells. The black sheet backdrop is transparent in the original sprite, as its ripper documents.')

# Whole Whispy is a background tree plus a face overlay in the source game.
sheet=clean('ka-whispy')
def wood_only(im):
    im=im.copy();im.putdata([(r,g,b,a if (r,g,b)in [(228,158,36),(84,30,4),(244,214,164)]else 0)for r,g,b,a in im.get_flattened_data()]);return im
def leaves_only(im):
    original=im.copy();im=Image.new('RGBA',im.size)
    for y in range(im.height):
        green=[x for x in range(im.width)if original.getpixel((x,y))[:3]in [(20,146,4),(4,82,4),(92,226,52)]]
        if not green:continue
        for x in range(min(green),max(green)+1):
            color=original.getpixel((x,y))[:3];im.putpixel((x,y),(*color,255)if color in [(20,146,4),(4,82,4),(92,226,52)]else (4,2,4,255))
    return im
canopy=Image.new('RGBA',(193,95));canopy.alpha_composite(leaves_only(sheet.crop((55,0,248,55))));canopy.alpha_composite(leaves_only(sheet.crop((55,74,248,133))),(0,36))
trunk=wood_only(sheet.crop((164,184,213,347)));tree=[]
for i in range(3):
    im=Image.new('RGBA',(200,225));im.alpha_composite(trunk,(80,58));im.alpha_composite(canopy,(0,0));face=sheet.crop((38+i*60,372,84+i*60,460));im.alpha_composite(face,(81,109));tree.append((im,[38+i*60,372,84+i*60,460]))
export('whispy','ka-whispy',KA,{'idle':tree[:2],'basic_resolve':tree,'skill_or_secondary':tree},body=221,world=135,facing='left',notes='NES scene canopy/trunk and native face overlays assembled as the original background boss. Face cells alone are never shown as the whole actor.')

# Preserve actual weapon pixels as independent combat projectiles.
for key,source,box,height,world in [
 ('bandana-spear','bandana-adaptation',[735,489,767,503],8,8),('nes-hammer','smb-enemies',[72,170,88,178],8,10),
 ('nes-flame','smb-enemies',[102,244,126,252],8,10),('nes-cutter','ka-kirby',[46,1043,62,1059],16,12),
 ('nes-star','gb-kirby',[70,13,85,29],16,12),('nes-bomb','ka-enemies',[134,757,150,774],16,12),
 ('nes-apple','ka-whispy',[158,572,175,590],18,12),('nes-kunai','ss-bio-spark',[79,169,95,179],10,9)]:
    export(key,source,RTDL if source=='bandana-adaptation'else SS if source.startswith('ss-')else SMB if source.startswith('smb-')else KA if source.startswith('ka-')else GB,
      {'idle':frames(source,[box])},body=height,world=world,adaptation=source=='bandana-adaptation',notes='Detached original source weapon/effect cell; not a fighter body.')

export('nes-spiny-egg','smb-enemies',SMB,{'idle':frames('smb-enemies',[[36,352,52,368],[54,352,70,368]])},
 body=16,world=12,notes='Both original 1985 Spiny egg cells, including the native brown/orange palette. Used for Lakitu flight, not a generic projectile dot.')

for key,boxes,world in [
 ('ka-flame',[[46+i*20,857,62+i*20,873]for i in range(4)],16),
 ('ka-spark-field',[[268,820,292,836],[306,820,330,836]],30),
 ('ka-ice-breath',[[150+i*41,857,187+i*41,873]for i in range(6)],14),
 ('ka-star',[[6,158,38,190]],12)]:
    export(key,'ka-kirby',KA,{'idle':frames('ka-kirby',boxes)},body=16,world=world,notes='Native detached ability effect, animated independently of the owner body.')

(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(OUT/'manifest.mjs').write_text('export default '+json.dumps(manifest,separators=(',',':'))+';\n')
contact=Image.new('RGB',(960,math.ceil(len(updated)/8)*150),'#e9e1cc');draw=ImageDraw.Draw(contact)
for i,key in enumerate(updated):
    icon=Image.open(OUT/(key+'-icon.png'));icon.thumbnail((105,105),Image.Resampling.NEAREST);x=i%8*120;y=i//8*150;contact.paste(icon,(x,y+10),icon);draw.text((x+3,y+122),key[:18],fill='#2b261e')
contact.save(ROOT/'docs/validation/sprite-review/faithful-contact.png')
contact.save(OUT/'contact-sheet.png')
# Full-body review is more informative than isolated first-frame icons.
for key in ['bandana','dedede','meta-knight','bowser','kirby','kirby-dream-land','kirby-sword','kirby-hammer','parasol','knuckle-joe','bio-spark','lakitu']:
    record=manifest[key];image=Image.open(ROOT/record['url']);labels=['idle','move_forward','basic_windup','basic_resolve','skill_or_secondary','ultimate_entry','hurt'];board=Image.new('RGB',(1440,len(labels)*132),'#ece2cc');pen=ImageDraw.Draw(board)
    for j,label in enumerate(labels):
        pen.text((4,j*132+3),key+' / '+label,fill='#332a23')
        for n,index in enumerate(record['clips'][label][:12]):
            x,y,w,h=record['frames'][index];frame=image.crop((x,y,x+w,y+h)).resize((w*2,h*2),Image.Resampling.NEAREST);left=n*120+60-int(record['pivot'][0]*2);top=j*132+113-int(record['pivot'][1]*2);board.paste(frame,(left,top),frame);pen.line((n*120,j*132+113,n*120+119,j*132+113),fill='#9f927d');pen.text((n*120+50,j*132+117),str(index),fill='#332a23')
    board.save(ROOT/('docs/validation/sprite-review/'+key+'-poses.png'))
print(f'Imported {len(updated)} reviewed atlases with fixed source-pixel scale.')
