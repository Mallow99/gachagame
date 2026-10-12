"""Batch candidate finder.

For each roster entry: find the wiki page, rank its images, download the best
N into cand/<id>/ and build sheets/<id>.png for review.

Usage: candidates.py ID [ID...]   (or 'all')
"""
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, os.path.dirname(__file__))
import wiki  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))

# id: (wiki host, page search/title, extra name tokens)
SPECS = json.load(open(os.path.join(HERE, "specs.json")))

GOOD = re.compile(r"render|artwork|official|promo|profile|transparent|full|body|png|art\b|key", re.I)
BAD = re.compile(r"logo|icon|flag|signature|episode|ep\d|screenshot|scene|title|card|map|ost|cover|"
                 r"\bep\b|s\d+e\d+|chapter|manga|panel|cap\d|\.gif$|\.svg$|\.webm$|\.ogg$|\.mp4", re.I)


def score(img, tokens):
    name = img["title"].lower()
    s = 0
    if name.endswith(".png"):
        s += 3
    if any(t in name for t in tokens):
        s += 3
    if GOOD.search(name):
        s += 2
    if BAD.search(name):
        s -= 4
    w, h = img["w"] or 0, img["h"] or 0
    if h > w:
        s += 1  # portraits suit splash art
    if min(w, h) >= 600:
        s += 1
    return s


def find_page(host, query):
    d = wiki.api(host, action="query", titles=query, redirects=1)
    pages = d.get("query", {}).get("pages", {})
    if pages and "-1" not in pages:
        return next(iter(pages.values()))["title"]
    hits = wiki.search(host, query)
    return hits[0] if hits else None


def run(cid, n=15):
    spec = SPECS[cid]
    host, query = spec["host"], spec["page"]
    tokens = [t.lower() for t in spec.get("tokens", query.split())]
    try:
        title = find_page(host, query)
        if not title:
            return cid, "no page", 0
        imgs = wiki.page_images(host, title, minpx=spec.get("minpx", 300))
        for extra in spec.get("pages", []):
            imgs += wiki.page_images(host, extra, minpx=spec.get("minpx", 300))
    except Exception as e:  # noqa: BLE001
        return cid, f"error {e}"[:120], 0
    seen, ranked = set(), []
    for im in sorted(imgs, key=lambda i: score(i, tokens), reverse=True):
        if im["url"] in seen or im["mime"] not in ("image/png", "image/jpeg", "image/webp", "image/gif"):
            continue
        seen.add(im["url"])
        ranked.append(im)
    ranked = ranked[:n]
    folder = os.path.join(HERE, "cand", cid)
    os.makedirs(folder, exist_ok=True)
    paths = []
    for i, im in enumerate(ranked):
        ext = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "image/gif": ".gif"}[im["mime"]]
        p = os.path.join(folder, f"{i:02d}{ext}")
        try:
            wiki.dl(im["url"], p)
            paths.append(p)
        except Exception:  # noqa: BLE001
            pass
    json.dump(ranked, open(os.path.join(folder, "index.json"), "w"), indent=1)
    os.makedirs(os.path.join(HERE, "sheets"), exist_ok=True)
    if paths:
        wiki.sheet(os.path.join(HERE, "sheets", f"{cid}.png"), paths, cell=180)
    return cid, title, len(paths)


if __name__ == "__main__":
    ids = list(SPECS) if sys.argv[1:] == ["all"] else sys.argv[1:]
    with ThreadPoolExecutor(6) as ex:
        for cid, title, k in ex.map(run, ids):
            print(f"{cid:16s} {k:3d}  {title}")
