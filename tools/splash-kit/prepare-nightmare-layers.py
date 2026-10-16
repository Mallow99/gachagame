"""Reproducible native-sprite part separation for the explicitly labeled rig proof.

No generative fill. The ripper documents black as transparent. Any newly
completed opaque cloth is authored in the renderer, not misattributed game art.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
source = ROOT / 'assets/sprites/sources/faithful/ka-nightmare.png'
record = next(s for s in json.loads((source.parent / 'INTAKE.json').read_text()) if s['name'] == 'ka-nightmare')
assert hashlib.sha256(source.read_bytes()).hexdigest() == record['sha256']
out = ROOT / 'demos/splash-kit/assets/nightmare-native'
out.mkdir(parents=True, exist_ok=True)
sheet = Image.open(source).convert('RGBA')
# Frontal entrance cell; complete native hands from the raised-hand entrance.
rects = {'face': [5, 4, 41, 32], 'torso': [5, 27, 41, 78],
         'hand-left': [60, 4, 72, 26], 'hand-right': [102, 4, 116, 26],
         'battlefield': [810, 510, 1066, 686]}
manifest = {'source': record, 'credit': 'Drshnaps (Jermungandr) / HAL Laboratory / Nintendo; Kirby’s Adventure (1993).', 'parts': {}}
for name, rect in rects.items():
    image = sheet.crop(tuple(rect))
    if name != 'battlefield':
        pixels = image.load()
        for y in range(image.height):
            for x in range(image.width):
                # The retained rip uses near-black (4,2,4), not RGB zero.
                if pixels[x, y][:3] in [(4, 2, 4), (0, 0, 0), (84, 110, 140)]:
                    pixels[x, y] = (0, 0, 0, 0)
        if name == 'torso':
            # Remove the source head and arms, which are separate parts now.
            for y in range(image.height):
                for x in range(image.width):
                    if y < 7 or x < 6 or x > 29:
                        pixels[x, y] = (0, 0, 0, 0)
        if name == 'face':
            # The frontal cell also includes blue shoulder/arm edges. They
            # must not travel upward with the face-only emergence shot.
            for y in range(18, image.height):
                for x in range(image.width):
                    if x < 9 or x > 26:
                        pixels[x, y] = (0, 0, 0, 0)
    target = out / f'{name}.png'
    image.save(target)
    manifest['parts'][name] = {'url': target.name, 'rect': rect, 'dimensions': list(image.size),
        'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
        'processing': 'Native rectangular part; documented near-black (4,2,4) and sheet backdrop removed. Torso excludes head/arm regions. No generated pixels.' if name != 'battlefield' else 'Unchanged native battlefield crop from the credited sprite sheet.'}
(out / 'SOURCES.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Verified and separated Nightmare native proof parts.')
