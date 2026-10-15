#!/usr/bin/env python3
"""Rebuild splash-kit art from demos/splash-kit/assets/SOURCES.json.

    python3 tools/splash-kit/prepare_art.py              # download, verify, bake every asset
    python3 tools/splash-kit/prepare_art.py --grid king-dedede
        # write <id>/rig-grid.jpg: the render over a labelled 0.1 UV grid, used to place deformers
    python3 tools/splash-kit/prepare_art.py --eyes king-dedede 0.44 0.26 0.62 0.40
        # print eye-white ellipses found inside that UV box, for the rig's `eyes` list

Downloads are cached in .cache/splash-kit/ and checked against the recorded SHA-256.
Needs Pillow and NumPy.
"""
import hashlib
import json
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'demos' / 'splash-kit' / 'assets'
CACHE = ROOT / '.cache' / 'splash-kit'
SOURCES = json.loads((ASSETS / 'SOURCES.json').read_text())


def fetch(asset_id):
    src = SOURCES[asset_id]
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / (asset_id + Path(src['url']).suffix)
    if not path.exists():
        req = urllib.request.Request(src['url'], headers={'User-Agent': 'pocket-gacha-splash-kit'})
        path.write_bytes(urllib.request.urlopen(req).read())
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != src['sha256']:
        sys.exit(f'{asset_id}: SHA-256 mismatch ({digest}). The source changed; review it before updating SOURCES.json.')
    return Image.open(path)


def bake(asset_id):
    src = SOURCES[asset_id]
    img = fetch(asset_id)
    out = ASSETS / src['output']
    out.parent.mkdir(parents=True, exist_ok=True)
    if src['kind'] == 'render':
        img = img.convert('RGBA')
        w = round(img.width * src['height'] / img.height)
        img.resize((w, src['height']), Image.LANCZOS).save(out, optimize=True)
    else:
        img = img.convert('RGB')
        h = round(img.height * src['width'] / img.width)
        img = img.resize((src['width'], h), Image.LANCZOS)
        if src.get('blur'):
            img = img.filter(ImageFilter.GaussianBlur(src['blur']))
        img.save(out, quality=84, optimize=True)
    print(f'{asset_id}: {out.relative_to(ROOT)} {Image.open(out).size}')


def grid(asset_id):
    src = SOURCES[asset_id]
    img = Image.open(ASSETS / src['output']).convert('RGBA')
    scale = 700 / img.height
    img = img.resize((round(img.width * scale), 700))
    board = Image.new('RGBA', img.size, (36, 36, 44, 255))
    board.alpha_composite(img)
    draw = ImageDraw.Draw(board)
    for i in range(1, 20):
        major = i % 2 == 0
        colour = (0, 255, 120, 255) if major else (0, 160, 80, 140)
        x, y = i * img.width / 20, i * img.height / 20
        draw.line([(x, 0), (x, img.height)], fill=colour)
        draw.line([(0, y), (img.width, y)], fill=colour)
        if major:
            draw.text((x + 2, 2), f'{i / 20:.1f}', fill=(255, 230, 0, 255))
            draw.text((2, y + 2), f'{i / 20:.1f}', fill=(255, 230, 0, 255))
    out = ASSETS / Path(src['output']).parent / 'rig-grid.jpg'
    board.convert('RGB').save(out, quality=85)
    print(out.relative_to(ROOT))


def eyes(asset_id, u0, v0, u1, v1):
    """Find near-white blobs (eye whites) in a UV box; print centre and radii in UV."""
    src = SOURCES[asset_id]
    a = np.asarray(Image.open(ASSETS / src['output']).convert('RGBA')).astype(int)
    h, w = a.shape[:2]
    x0, x1, y0, y1 = int(u0 * w), int(u1 * w), int(v0 * h), int(v1 * h)
    box = a[y0:y1, x0:x1]
    white = (box[..., :3].min(axis=2) > 215) & (box[..., 3] > 200)
    ys, xs = np.nonzero(white)
    if not len(xs):
        sys.exit('No eye-white pixels in that box.')
    cols = np.unique(xs)
    gaps = np.diff(cols)
    splits = [cols[0]] + [cols[i + 1] for i in np.nonzero(gaps > 2)[0]] + [cols[-1] + 1]
    for left, right in zip(splits, splits[1:]):
        m = (xs >= left) & (xs < right)
        if m.sum() < 30:
            continue
        ex, ey = xs[m] + x0, ys[m] + y0
        cu, cv = (ex.min() + ex.max()) / 2 / w, (ey.min() + ey.max()) / 2 / h
        ru, rv = (ex.max() - ex.min()) / 2 / w, (ey.max() - ey.min()) / 2 / h
        print(f'{{ center: [{cu:.3f}, {cv:.3f}], radius: [{ru * 1.08:.3f}, {rv * 1.08:.3f}] }}')


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['--grid']:
        grid(args[1])
    elif args[:1] == ['--eyes']:
        eyes(args[1], *map(float, args[2:6]))
    else:
        for key in SOURCES:
            bake(key)
