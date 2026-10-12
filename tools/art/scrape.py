"""scrape.py OUTDIR URL [URL...]  - pull og:image and large-looking <img> files from pages."""
import html
import os
import re
import sys
from urllib.parse import urljoin

sys.path.insert(0, os.path.dirname(__file__))
import wiki  # noqa: E402
from PIL import Image  # noqa: E402

UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36"}
SKIP = re.compile(r"logo|icon|avatar|sprite-sheet-ui|banner-ad|pixel|1x1|favicon|badge|button", re.I)

outdir, *urls = sys.argv[1:]
os.makedirs(outdir, exist_ok=True)
n = len(os.listdir(outdir))
for page in urls:
    try:
        r = wiki.S.get(page, headers=UA, timeout=30)
        text = r.text
    except Exception as e:  # noqa: BLE001
        print("page fail", page, e)
        continue
    found = re.findall(r'property="og:image"\s+content="([^"]+)"', text)
    found += re.findall(r'(?:src|data-src|href)="([^"]+\.(?:png|jpe?g|webp)(?:\?[^"]*)?)"', text, re.I)
    seen = []
    for u in found:
        u = urljoin(page, html.unescape(u))
        if u not in seen and not SKIP.search(u):
            seen.append(u)
    got = 0
    for u in seen[:12]:
        try:
            p = os.path.join(outdir, f"{n:02d}{os.path.splitext(u.split('?')[0])[1][:5] or '.png'}")
            wiki.dl(u, p)
            im = Image.open(p)
            if min(im.size) < 220:
                os.remove(p)
                continue
            print(f"{im.size[0]}x{im.size[1]}\t{p}\t{u[:100]}")
            n += 1
            got += 1
            if got >= 4:
                break
        except Exception:  # noqa: BLE001
            if os.path.exists(p):
                os.remove(p)
