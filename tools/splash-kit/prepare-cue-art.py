"""Bake cue-only cutouts from retained, credited originals; leave game assets untouched."""
from collections import deque
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'demos/splash-kit/assets/cue-fighters'
IDS = {'bio-spark', 'bowser', 'sir-kibble', 'poppy-bros-jr', 'princess-peach', 'hammer-bro', 'lakitu', 'toad'}
records = json.loads((ROOT / 'assets/portraits/source-era/INTAKE.json').read_text())
OUT.mkdir(parents=True, exist_ok=True)
manifest = {}
for record in records:
    if record['id'] not in IDS:
        continue
    source = ROOT / record['path']
    if hashlib.sha256(source.read_bytes()).hexdigest() != record['sha256']:
        raise ValueError('Source changed: ' + record['id'])
    image = Image.open(source).convert('RGBA')
    image.thumbnail((896, 896), Image.Resampling.LANCZOS)
    pixels = np.array(image)
    rgb = pixels[:, :, :3].astype(np.int16)
    # Only near-neutral white connected to the outside is removed. White gloves,
    # eyes and other regions enclosed by the drawing's outlines are preserved.
    white = (rgb.min(axis=2) > 232) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 22)
    h, w = white.shape
    removed = np.zeros((h, w), dtype=bool)
    queue = deque()
    for x, y in [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]:
        if white[y, x] and not removed[y, x]:
            removed[y, x] = True
            queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and white[ny, nx] and not removed[ny, nx]:
                removed[ny, nx] = True
                queue.append((nx, ny))
    pixels[removed, 3] = 0
    cutout = Image.fromarray(pixels)
    bounds = cutout.getchannel('A').getbbox()
    if not bounds or removed.sum() == 0:
        raise ValueError('No edge-white field found: ' + record['id'])
    target = OUT / (record['id'] + '.webp')
    cutout.crop(bounds).save(target, format='WEBP', quality=96, method=6)
    manifest[record['id']] = {
        'url': target.name, 'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
        'source': record, 'processing': '896px maximum; edge-connected neutral white >232 removed; alpha bounds trimmed',
    }
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('Prepared', len(manifest), 'cue cutouts with original provenance and output hashes.')
