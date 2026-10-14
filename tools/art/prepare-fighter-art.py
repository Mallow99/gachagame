"""Prepare complete fighter artwork for the game's narrow high-DPI window.

Original downloads remain untouched. No crop, recolor, upscaling or artwork
generation; Pillow is a development dependency, not part of the game runtime.
"""
from pathlib import Path
from PIL import Image
import json, hashlib

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'assets/portraits/source-era'
records=json.loads((OUT/'INTAKE.json').read_text())
old=json.loads((OUT/'manifest.mjs').read_text().removeprefix('export default ').rstrip(';\n'))
manifest={}
for record in records:
    source=ROOT/record['path']
    if hashlib.sha256(source.read_bytes()).hexdigest()!=record['sha256']:
        raise ValueError('Source hash differs from credited intake: '+record['id'])
    original=Image.open(source).convert('RGBA')
    outputs={}
    for kind,maximum in [('display',896),('thumbnails',256)]:
        image=original.copy();image.thumbnail((maximum,maximum),Image.Resampling.LANCZOS)
        target=OUT/kind/(record['id']+'.webp');target.parent.mkdir(exist_ok=True)
        image.save(target,format='WEBP',quality=94,method=6)
        outputs[kind]={'url':str(target.relative_to(ROOT)),'dimensions':list(image.size),
                      'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
    previous=old[record['id']]
    manifest[record['id']]={**previous,'url':outputs['display']['url'],
      'thumbnailUrl':outputs['thumbnails']['url'],'originalUrl':record['path'],'output':outputs}
(OUT/'manifest.mjs').write_text('export default '+json.dumps(manifest,separators=(',',':'))+';\n')
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared',len(manifest),'complete fighter illustrations and thumbnails.')
