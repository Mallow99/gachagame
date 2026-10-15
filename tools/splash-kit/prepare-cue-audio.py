"""Verify retained game archives and bake short native calls for cue 02."""
from pathlib import Path
import hashlib
import json
import subprocess
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / '.cache/cue02-audio'
OUT = ROOT / 'demos/splash-kit/assets/audio/cue02'
SOURCES = [
    ('dedede', '409644', '1755536711', '77f1310ebc3d3cc08a4f4996254212b4216c2db0624b00f475d45aad432f8b16', 'vc_dedede/vc_dedede_appeal02.wav', '[A king’s laugh.]'),
    ('bowser', '409621', '1755536701', '67879bd201572293bcddfc7a2952778ec3c46e47e93bbb61bc3afba8faf66857', 'vc_koopa/vc_koopa_wait2.wav', '[A low, rumbling growl.]'),
]
CACHE.mkdir(parents=True, exist_ok=True)
(OUT / 'sources').mkdir(parents=True, exist_ok=True)
manifest = {}
for name, asset_id, updated, archive_hash, member, caption in SOURCES:
    url = f'https://sounds.spriters-resource.com/media/assets/406/{asset_id}.zip?updated={updated}'
    archive = CACHE / f'{name}-ultimate.zip'
    if not archive.exists():
        request = urllib.request.Request(url, headers={'User-Agent': 'Pocket-Gacha-private-study'})
        archive.write_bytes(urllib.request.urlopen(request).read())
    if hashlib.sha256(archive.read_bytes()).hexdigest() != archive_hash:
        raise ValueError('Audio archive changed: ' + name)
    source = OUT / 'sources' / f'{name}-call.wav'
    with zipfile.ZipFile(archive) as package:
        source.write_bytes(package.read('Super Smash Bros Ultimate/Fighters/' + member))
    target = OUT / f'{name}-call.mp3'
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
        '-af', 'highpass=f=65,lowpass=f=14000,loudnorm=I=-18:TP=-2:LRA=6,afade=t=in:d=0.008',
        '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '160k', str(target)], check=True)
    duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(target)]))
    manifest[name] = {
        'url': target.name, 'duration': duration, 'caption': caption,
        'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
        'source': {'url': url, 'page': f'https://sounds.spriters-resource.com/nintendo_switch/supersmashbrosultimate/asset/{asset_id}/',
            'archiveSha256': archive_hash, 'member': member, 'path': str(source.relative_to(ROOT)),
            'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'credit': 'Super Smash Bros. Ultimate (2018). Nintendo / HAL Laboratory / Bandai Namco / Sora. Archive uploaded by Random Talking Bush, hosted by The Sounds Resource.'},
        'processing': 'Native nonverbal call. No pitch/tempo change; 65Hz high-pass, 14kHz low-pass, -18 LUFS / -2dBTP, 8ms fade-in; mono 44.1kHz MP3.',
    }
(OUT / 'SOURCES.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({name: {'duration': item['duration'], 'sha256': item['sha256']} for name, item in manifest.items()}))
