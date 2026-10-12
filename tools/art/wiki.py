"""Art research helper: query Fandom/MediaWiki APIs, download images, build contact sheets.

Usage:
  wiki.py search WIKI_HOST "query"              # page titles
  wiki.py files WIKI_HOST "query" [limit]       # search File: namespace, with sizes + urls
  wiki.py page WIKI_HOST "Page Title" [minpx]   # images used on a page, with sizes + urls
  wiki.py dl URL OUTFILE
  wiki.py sheet OUTFILE IMG...                  # labeled contact sheet
"""
import json
import re
import os
import sys

import requests
from PIL import Image, ImageDraw

UA = {"User-Agent": "PocketGachaArtResearch/0.1 (personal hobby project)"}
S = requests.Session()
S.headers.update(UA)
S.verify = os.environ.get("REQUESTS_CA_BUNDLE", True)


def api(host, **params):
    params.setdefault("format", "json")
    last = None
    for path in (_API_PATH.get(host), "/api.php", "/w/api.php"):
        if not path:
            continue
        try:
            r = S.get(f"https://{host}{path}", params=params, timeout=30)
            r.raise_for_status()
            data = r.json()
            _API_PATH[host] = path
            return data
        except Exception as e:  # noqa: BLE001
            last = e
    raise last


_API_PATH = {}


def search(host, q, ns=0, limit=10):
    d = api(host, action="query", list="search", srsearch=q, srnamespace=ns, srlimit=limit)
    return [x["title"] for x in d.get("query", {}).get("search", [])]


def info(host, titles):
    out = []
    for i in range(0, len(titles), 40):
        d = api(host, action="query", titles="|".join(titles[i:i + 40]), prop="imageinfo",
                iiprop="url|size|mime")
        for p in d.get("query", {}).get("pages", {}).values():
            ii = (p.get("imageinfo") or [{}])[0]
            if ii.get("url"):
                out.append({"title": p["title"], "w": ii.get("width"), "h": ii.get("height"),
                            "mime": ii.get("mime"), "url": ii["url"]})
    return out


def page_images(host, title, minpx=0):
    titles, cont = [], {}
    while True:
        d = api(host, action="query", titles=title, prop="images", imlimit=500, redirects=1, **cont)
        for p in d.get("query", {}).get("pages", {}).values():
            titles += [x["title"] for x in p.get("images", [])]
        if "continue" not in d:
            break
        cont = d["continue"]
    res = info(host, titles)
    return [r for r in res if max(r["w"] or 0, r["h"] or 0) >= minpx]


def dl(url, out):
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    r = S.get(url, timeout=60)
    r.raise_for_status()
    with open(out, "wb") as f:
        f.write(r.content)
    return out


def sheet(out, paths, cell=200):
    paths = [p for p in paths if os.path.exists(p)]
    cols = min(5, max(1, len(paths)))
    rows = (len(paths) + cols - 1) // cols
    W, H = cols * cell, rows * (cell + 28)
    canvas = Image.new("RGB", (W, H), (40, 40, 52))
    d = ImageDraw.Draw(canvas)
    for i, p in enumerate(paths):
        x, y = (i % cols) * cell, (i // cols) * (cell + 28)
        # checkerboard so transparency is visible
        for cy in range(0, cell, 16):
            for cx in range(0, cell, 16):
                if (cx // 16 + cy // 16) % 2:
                    d.rectangle([x + cx, y + cy, x + cx + 15, y + cy + 15], fill=(60, 60, 74))
        try:
            im = Image.open(p)
            label = f"{i}: {os.path.basename(p)[:26]} {im.size[0]}x{im.size[1]}"
            im = im.convert("RGBA")
            im.thumbnail((cell - 8, cell - 8), Image.NEAREST if max(im.size) < 120 else Image.LANCZOS)
            canvas.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im)
        except Exception as e:  # noqa: BLE001
            label = f"{i}: ERR {e}"[:40]
        d.text((x + 4, y + cell + 6), label, fill=(230, 230, 240))
    canvas.save(out)
    return out


if __name__ == "__main__":
    cmd, *a = sys.argv[1:]
    if cmd == "search":
        print(json.dumps(search(a[0], a[1]), indent=1))
    elif cmd == "files":
        titles = search(a[0], a[1], ns=6, limit=int(a[2]) if len(a) > 2 else 20)
        for r in info(a[0], titles):
            print(f'{r["w"]}x{r["h"]}\t{r["title"]}\t{r["url"]}')
    elif cmd == "page":
        for r in page_images(a[0], a[1], int(a[2]) if len(a) > 2 else 0):
            print(f'{r["w"]}x{r["h"]}\t{r["title"]}\t{r["url"]}')
    elif cmd == "dl":
        print(dl(a[0], a[1]))
    elif cmd == "sheet":
        print(sheet(a[0], a[1:]))


def bing(q, transparent=True, n=20):
    import html as _html
    import re
    params = {"q": q, "form": "IRFLTR", "first": 1}
    if transparent:
        params["qft"] = "+filterui:photo-transparent"
    r = S.get("https://www.bing.com/images/search", params=params, timeout=30,
              headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/141.0 Safari/537.36", "Accept-Language": "en-US"})
    out = []
    for m in re.finditer(r'class="iusc"[^>]*?\sm="([^"]+)"', r.text):
        try:
            d = json.loads(_html.unescape(m.group(1)))
        except ValueError:
            continue
        if d.get("murl"):
            out.append({"url": d["murl"], "page": d.get("purl", ""), "title": d.get("t", "")})
        if len(out) >= n:
            break
    return out


if __name__ == "__main__" and sys.argv[1] == "bing":
    for r in bing(sys.argv[2], transparent=len(sys.argv) < 4 or sys.argv[3] != "any"):
        print(f'{r["url"]}\t{r["title"][:60]}')


if __name__ == "__main__" and sys.argv[1] == "get":
    # get HOST OUTDIR "File:A" "File:B" ...
    host, outdir, *titles = sys.argv[2:]
    os.makedirs(outdir, exist_ok=True)
    for i, r in enumerate(info(host, titles)):
        ext = os.path.splitext(r["title"])[1].lower() or ".png"
        slug = re.sub(r"[^a-z0-9]+", "_", r["title"][5:].lower()).strip("_")[:40]
        p = os.path.join(outdir, f"{slug}{ext}")
        dl(r["url"], p)
        print(f'{r["w"]}x{r["h"]}\t{p}')
