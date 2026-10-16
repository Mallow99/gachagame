"""Matched Adventure poses + authored pixel cloth/grips. No generated images.

All extension pixels are explicit palette-indexed sprite work. Source pixels
stay at native proportions; output metadata distinguishes original from authored.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'assets/sprites/sources/faithful/ka-nightmare.png'
record = next(s for s in json.loads((SOURCE.parent / 'INTAKE.json').read_text()) if s['name'] == 'ka-nightmare')
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == record['sha256']
sheet = Image.open(SOURCE).convert('RGBA')
OUT = ROOT / 'demos/splash-kit/assets/nightmare-sprites'
OUT.mkdir(parents=True, exist_ok=True)
reference = Image.new('RGBA', (360, 100), (8, 8, 24, 255))
boxes = [[4, 3, 43, 79], [48, 3, 130, 79], [132, 3, 213, 79], [215, 3, 296, 79]]
def clean(rect):
    im = sheet.crop(tuple(rect))
    im.putdata([(116, 42, 252, a) if (r, g, b) == (236, 106, 252) else
                (r, g, b, 0 if (r, g, b) in [(4, 2, 4), (84, 110, 140), (0, 0, 0)] else a)
                for r, g, b, a in im.get_flattened_data()])
    return im
for i, rect in enumerate(boxes):
    im = clean(rect)
    reference.alpha_composite(im, (i * 90 + (90 - im.width) // 2, 5))
    ImageDraw.Draw(reference).text((i * 90 + 5, 85), str(i), fill='white')
reference.resize((1080, 300), Image.Resampling.NEAREST).save(ROOT / 'out/nightmare-source-poses.png')

INK = (4, 2, 4, 255)
BLUE = (28, 94, 212, 255)
DARK_BLUE = (4, 42, 140, 255)
VIOLET = (116, 42, 252, 255)
WHITE = (252, 254, 252, 255)
CLEAR = (0, 0, 0, 0)
manifest = {'source': record, 'credit': 'Drshnaps (Jermungandr) / HAL Laboratory / Nintendo; Kirby’s Adventure (1993).',
            'paletteMapping': {'236,106,252': [116, 42, 252], 'reason': 'The sheet labels pink as a replaceable colour; use the native violet ramp.'},
            'palette': [list(c[:3]) for c in [INK, DARK_BLUE, BLUE, VIOLET, WHITE]], 'assets': {},
            'poseSize': [82, 76], 'headPivot': [39, 18],
            'hands': {'left': {'rect': [12, 0, 22, 19], 'grip': [2, 9]}, 'right': {'rect': [58, 0, 68, 19], 'grip': [7, 9]}},
            'curtain': {'size': [84, 160], 'grip': [82, 64], 'frames': 8}}
def save(name, image, origin, detail):
    target = OUT / f'{name}.png'
    image.save(target)
    manifest['assets'][name] = {'url': target.name, 'dimensions': list(image.size),
        'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'origin': origin, 'detail': detail}

# The complete native pose is the reference. Every moving piece has the SAME
# 82x76 canvas/pivot; assembling the separated parts is pixel-identical to it.
head_rect = [32, 9, 49, 26]
for frame, box in enumerate(boxes[1:]):
    pose = Image.new('RGBA', (82, 76))
    pose.alpha_composite(clean(box), (0, 0))
    save(f'pose-{frame}', pose, 'native', {'sourceRect': box})
    if frame == 0:
        body = pose.copy()
        parts = [('head', head_rect), ('left', manifest['hands']['left']['rect']), ('right', manifest['hands']['right']['rect'])]
        for name, rect in parts:
            layer = Image.new('RGBA', pose.size)
            mask = Image.new('L', pose.size)
            if name == 'head':
                ImageDraw.Draw(mask).polygon([(32, 9), (48, 9), (48, 18), (44, 20), (44, 25), (35, 25), (35, 20), (32, 18)], fill=255)
            else:
                ImageDraw.Draw(mask).rectangle((rect[0], rect[1], rect[2] - 1, rect[3] - 1), fill=255)
            layer.paste(pose, (0, 0), mask)
            save(name, layer, 'native', {'sourceRect': box, 'maskRect': rect, 'canvasRetained': True})
            body.paste(CLEAR, (0, 0, 82, 76), mask)
        save('body', body, 'native', {'sourceRect': box, 'removed': [r for n, r in parts]})
        joined = body.copy()
        for name, rect in parts:
            joined.alpha_composite(Image.open(OUT / f'{name}.png'))
        assert joined.tobytes() == pose.tobytes(), 'Separated parts changed the native pose'

# Native wrists remain intact. New curl/grip pixels use exactly that palette.
for side in ['left', 'right']:
    rect = manifest['hands'][side]['rect']
    palm = Image.open(OUT / 'pose-0.png').crop(tuple(rect))
    save(f'hand-{side}-open', palm, 'native', {'sourceRect': boxes[1], 'poseRect': rect})
    # Build in a left-hand convention; mirror the authored curl for the right.
    back = Image.new('RGBA', (10, 19))
    cuff = palm if side == 'left' else palm.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    back.alpha_composite(cuff.crop((0, 14, 10, 19)), (0, 14))
    d = ImageDraw.Draw(back)
    d.polygon([(2, 5), (5, 4), (8, 6), (9, 11), (6, 15), (3, 16), (0, 12), (0, 8)], fill=VIOLET, outline=BLUE)
    d.line([(2, 7), (2, 12), (4, 14)], fill=WHITE, width=2)
    d.line([(4, 5), (6, 5), (7, 7)], fill=WHITE)
    d.line([(5, 14), (6, 11), (7, 10)], fill=INK)
    front = Image.new('RGBA', (10, 19))
    f = ImageDraw.Draw(front)
    # Three curled fingers cross the cloth edge; dark gaps keep them legible.
    for y in [6, 9, 12]:
        f.line([(0, y), (4, y), (5, y + 1), (3, y + 2)], fill=BLUE)
        f.line([(0, y), (3, y), (4, y + 1)], fill=WHITE)
        f.point((3, y + 1), fill=VIOLET)
    if side == 'right':
        back = back.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        front = front.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    save(f'hand-{side}-back', back, 'authored', 'Native wrist plus explicit palette-indexed gripping palm. Draw behind cloth.')
    save(f'hand-{side}-front', front, 'authored', 'Curled finger sprite. Draw over cloth, at the same grip anchor.')

# Artist-authored pixel curtains: full opaque cloth, stepped hem, sparse
# embroidery, dithered folds and a crease fan that gathers at one fixed grip.
import math
def curtain(frame, wrapping=False):
    im = Image.new('RGBA', (84, 160))
    pix = im.load()
    fold = frame / 7
    for y in range(160):
        edge = 82 + (0 if y == 64 else round(math.sin((y - 64) / 17) * (1 - fold)))
        left = 0
        if wrapping:
            if frame == 7:
                continue
            left = round(fold * (84 + abs(y - 64) * .55))
            if y < round(fold * 60) or y > 160 - round(fold * 98):
                continue
        for x in range(max(0, left), min(84, edge + 1)):
            # Dither levels, never a vector gradient or translucent panel.
            stripe = (x + round(math.sin(y / 29) * 2) + frame // 2) % 22
            colour = INK
            if stripe in [2, 3, 4, 5]: colour = DARK_BLUE
            if stripe == 4: colour = BLUE
            if stripe == 5 and y % 4 == 0: colour = VIOLET
            if x == edge: colour = BLUE
            if x == edge - 1 and y % 6 < 2: colour = VIOLET
            pix[x, y] = colour
    d = ImageDraw.Draw(im)
    # Cloth bunches toward the actual hand contact. The fan is clipped to ink.
    ink_mask = im.getchannel('A')
    details = Image.new('RGBA', im.size)
    e = ImageDraw.Draw(details)
    for n, end in enumerate([(63, 32), (60, 95), (72, 118)]):
        e.line([end, (70, (end[1] + 64) // 2), (81, 64)], fill=BLUE)
        e.line([(end[0] - 1, end[1]), (69, (end[1] + 64) // 2), (80, 64)], fill=INK)
    for x, y in [(17, 28), (54, 19), (34, 77), (66, 111), (14, 134), (54, 149)]:
        e.line([(x, y - 3), (x, y + 3)], fill=BLUE)
        e.line([(x - 3, y), (x + 3, y)], fill=BLUE)
        e.point((x, y), fill=WHITE)
        e.point((x + 1, y - 1), fill=VIOLET)
    details.putalpha(Image.frombytes('L', im.size, bytes(min(a, b) for a, b in zip(details.getchannel('A').tobytes(), ink_mask.tobytes()))))
    im.alpha_composite(details)
    return im
for kind in ['curtain', 'wrap']:
    atlas = Image.new('RGBA', (84 * 8, 160))
    for frame in range(8): atlas.alpha_composite(curtain(frame, kind == 'wrap'), (84 * frame, 0))
    save(kind, atlas, 'authored', 'Eight palette-indexed cloth frames, opaque fill, stepped hem and folds gathering at local (82,64). Wrap folds tuck upward into the source pose.')

save('battlefield', sheet.crop((810, 510, 1066, 686)), 'native', {'sourceRect': [810, 510, 1066, 686]})
# Looming cloak shadow derived from the complete source silhouette, not the
# old storyboard shape. Complete its black interior row by row.
closed = clean(boxes[0])
shadow = Image.new('RGBA', closed.size)
sd = ImageDraw.Draw(shadow)
for y in range(closed.height):
    xs = [x for x in range(closed.width) if closed.getpixel((x, y))[3]]
    if xs: sd.line((min(xs), y, max(xs), y), fill=(6, 6, 20, 255))
save('shadow', shadow, 'derived-native', {'sourceRect': boxes[0], 'processing': 'Opaque silhouette filled between native row extrema; no distortion.'})
(OUT / 'SOURCES.json').write_text(json.dumps(manifest, indent=2) + '\n')

# One inspectable development reference: native whole, separated/reassembled
# whole and the three contact layers. Not a runtime asset.
debug = Image.new('RGBA', (220, 100), (8, 8, 24, 255))
debug.alpha_composite(Image.open(OUT / 'pose-0.png'), (3, 3))
debug.alpha_composite(joined, (90, 3))
for i, name in enumerate(['hand-left-open', 'hand-left-back', 'hand-left-front']):
    debug.alpha_composite(Image.open(OUT / f'{name}.png'), (185, 4 + i * 30))
debug.resize((880, 400), Image.Resampling.NEAREST).save(ROOT / 'out/nightmare-sprite-reference.png')
print('Verified native assembly exactly matches source; baked pixel curtains and grip sprites.')
