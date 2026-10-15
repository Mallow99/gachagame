"""Verify game recordings, then bake normal-tempo area and showcase music beds."""
from pathlib import Path
import hashlib
import json
import subprocess
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / '.cache/cue03-music'
OUT = ROOT / 'demos/splash-kit/assets/audio/areas'
SOURCES = [
    ('dream', 'Fountain of Dreams', "Kirby's Adventure", 1993, 'nintendo-nes-nsf', 'kirbys-adventure',
     '30%20-%20Fountain%20of%20Dreams.mp3', '73941a09ac0ed70deebac1267990bff065033ee98bf1a70980a13477b4a6d47b',
     'Hirokazu Ando / Jun Ishikawa, HAL Laboratory / Nintendo; NSF recording hosted by Zophar’s Domain.'),
    ('mushroom', 'Running About (Overworld)', 'Super Mario Bros.', 1985, 'nintendo-nes-nsf', 'super-mario-bros',
     '1%20-%20Running%20About.mp3', '1b5db03861ebe7eab6105454ffc49bb8e32fab93905e1bd17ef5947b4f6f60ab',
     'Koji Kondo / Nintendo; NSF recording hosted by Zophar’s Domain.'),
    ('dedede-theme', "King Dedede's Theme", 'Kirby Super Star', 1996, 'nintendo-snes-spc', 'kirby-super-star-%5Bkirbys-fun-pak%5D',
     '11%20King%20Dedede%27s%20Theme.mp3', '4170e838704418fe22bdc707a093a3583ed6518197972fac3eb488359206e04d',
     'Jun Ishikawa / HAL Laboratory / Nintendo; SPC recording hosted by Zophar’s Domain. Related character music; not claimed to originate in Adventure (1993).'),
    ('nightmare-theme', 'Nightmare (Final Boss)', "Kirby's Adventure", 1993, 'nintendo-nes-nsf', 'kirbys-adventure',
     '34%20-%20Nightmare.mp3', 'bc0c8c6e58a231e02bff0b65654ce4ddc382146f428bd0d3ea1f5ba13954f5e1',
     'Hirokazu Ando / Jun Ishikawa, HAL Laboratory / Nintendo; NSF recording hosted by Zophar’s Domain.'),
]
CACHE.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
manifest = {}
for area, title, game, year, platform, slug, track, source_hash, credit in SOURCES:
    url = f'https://fi.zophar.net/soundfiles/{platform}/{slug}/{track}'
    original = CACHE / f'{area}.mp3'
    if not original.exists():
        request = urllib.request.Request(url, headers={'User-Agent': 'Pocket-Gacha-private-study'})
        original.write_bytes(urllib.request.urlopen(request).read())
    if hashlib.sha256(original.read_bytes()).hexdigest() != source_hash:
        raise ValueError('Area recording changed: ' + area)
    target = OUT / (f'{area}.mp3' if area.endswith('-theme') else f'{area}-theme.mp3')
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(original), '-t', '48',
        '-af', 'loudnorm=I=-20:TP=-2:LRA=6,afade=t=in:d=0.04,afade=t=out:st=47.8:d=0.2',
        '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '128k', str(target)], check=True)
    duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(target)]))
    manifest[area] = {'url': target.name, 'title': title, 'game': game, 'year': year, 'duration': duration,
        'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
        'source': {'url': url, 'page': f'https://www.zophar.net/music/{platform}/{slug}',
                   'sha256': source_hash, 'credit': credit},
        'processing': 'First 48 seconds, -20 LUFS / -2 dBTP, 40ms entry and 200ms exit fades, mono 44.1kHz MP3. No pitch or tempo change. Full downloads verified in rebuild cache, not bundled at runtime.'}
(OUT / 'SOURCES.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({area: {'duration': item['duration'], 'sha256': item['sha256']} for area, item in manifest.items()}))
