"""Prepare whole, credited source artwork for narrow high-DPI game windows.

Original downloads remain untouched. Display/thumbnail copies preserve the
whole composition and alpha; this is an asset-size build step, not new artwork.
Pillow is a development dependency only.
"""
from pathlib import Path
from PIL import Image
import json,hashlib
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/portraits/supply'
records=json.loads((OUT/'INTAKE.json').read_text())
manifest={}
for record in records:
    if record.get('active',True) is False:
        continue
    source=ROOT/record['path']
    if hashlib.sha256(source.read_bytes()).hexdigest()!=record['sha256']:
        raise ValueError('Source hash differs from credited intake: '+record['id'])
    original=Image.open(source).convert('RGBA')
    if record.get('sourceType')=='rendered-source-model':
        # The complete object stays intact; discard only empty render canvas.
        original=original.crop(original.getbbox())
    paths={}
    for kind,maximum in [('display',896),('thumbnails',256)]:
        image=original.copy();image.thumbnail((maximum,maximum),Image.Resampling.LANCZOS)
        target=OUT/kind/(record['id']+'.webp');target.parent.mkdir(exist_ok=True)
        image.save(target,format='WEBP',quality=92,method=6)
        paths[kind]={'url':str(target.relative_to(ROOT)),'dimensions':list(image.size),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
    manifest[record['id']]={'url':paths['display']['url'],'thumbnailUrl':paths['thumbnails']['url'],
      'style':record['style'],'sourceGameId':record['sourceGameId'],'sourceTitle':record['sourceTitle'],
      'credit':record.get('creditLine')or record['credit']+' · '+record['sourceGameId'][-4:]+' source art','output':paths}
(OUT/'manifest.mjs').write_text('export default '+json.dumps(manifest,separators=(',',':'))+';\n')
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared',len(manifest),'complete Supply illustrations and thumbnails.')
