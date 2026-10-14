"""Verify that extraction preserves source pixels, including raised weapons.

This is an asset development check, not a game runtime dependency. Composited
boss layers have their own documented assembly and are checked visually.
"""
from pathlib import Path
from PIL import Image
import json, runpy

ROOT=Path(__file__).resolve().parents[2]
review=runpy.run_path(str(Path(__file__).with_name('catalog-faithful-sheets.py')))
clean=review['clean'];manifest=json.loads((ROOT/'assets/sprites/v1/manifest.json').read_text())
checks=[]
for key,d in manifest.items():
    if not d.get('frameMetadata')or key in ['kracko','kracko-jr','whispy']:continue
    source=Path(d['sourceFiles'][0]).stem;atlas=Image.open(ROOT/d['url']).convert('RGBA')
    for index,meta in enumerate(d['frameMetadata']):
        original=clean(source).crop(meta['sourceRect'])
        if key=='nightmare':
            original.putdata([(r,g,b,0 if (r,g,b)in [(0,0,0),(4,2,4)]else a)for r,g,b,a in original.get_flattened_data()])
        x,y,w,h=d['frames'][index];frame=atlas.crop((x,y,x+w,y+h))
        source_pixels=sum(a>0 for r,g,b,a in original.get_flattened_data());atlas_pixels=sum(a>0 for r,g,b,a in frame.get_flattened_data())
        assert source_pixels==atlas_pixels,f'{key}:{index} lost/resized source pixels: {source_pixels} != {atlas_pixels}'
        assert source_pixels>=12,f'{key}:{index} nearly empty source cell'
        assert meta['pixelScale']==1
    checks.append({'key':key,'sourceGameId':d['sourceGameId'],'frames':len(d['frames']),'sourcePixelsPreserved':True})
out=ROOT/'docs/validation/sprite-review/body-pixel-verification.json'
out.write_text(json.dumps({'method':'Actual source/atlas opaque-pixel counts for every extracted frame; palette swaps preserve alpha. Composite tree/cloud layers are separately reviewed.','atlases':checks},indent=2)+'\n')
print(f'Preserved source pixels across {sum(c["frames"]for c in checks)} frames in {len(checks)} atlases.')
