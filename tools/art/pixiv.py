"""Art research helper for Pixiv (Japanese fan art). No login needed.

Pixiv's public ajax API allows tag search and artwork details without an
account; only "sort by popularity" is paywalled. Two workarounds:
  - popularity tags: "マリオ1000users入り" = works with 1000+ bookmarks
  - rank by bookmarkCount from the details call (what `rank` does)
Image files on i.pximg.net need a pixiv.net Referer header, which `dl` sends.

Usage:
  pixiv.py search OUT.json "tag" ["tag" ...] [--pages N]   # collect + rank by bookmarks
  pixiv.py artist OUT.json ARTWORK_ID [--must マリオ]      # an artist's whole portfolio, ranked
  pixiv.py dl IN.json OUTDIR [--top N] [--size small|regular|original]

Useful tags for Mario: マリオ, マリオ(スーパーマリオ), スーパーマリオ, マリオ 100users入り,
マリオ1000users入り, スーパーマリオブラザーズワンダー 100users入り. Chinese: 马里奥, 马力欧.
Tag searches are AND-ed with spaces. Works Pixiv flags as AI-generated (aiType 2) are dropped.
"""
import argparse
import json
import os
import sys
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

import requests

S = requests.Session()
S.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126 Safari/537.36",
    "Referer": "https://www.pixiv.net/",
})
S.verify = os.environ.get("REQUESTS_CA_BUNDLE", True)
BASE = "https://www.pixiv.net/ajax"


def get(url, tries=4):
    for i in range(tries):
        try:
            r = S.get(url, timeout=30)
            r.raise_for_status()
            return r.json()["body"]
        except Exception:  # noqa: BLE001
            if i == tries - 1:
                raise
            time.sleep(2 + 2 * i)


def search_ids(tag, pages):
    q = urllib.parse.quote(tag)
    out = []
    for p in range(1, pages + 1):
        b = get(f"{BASE}/search/artworks/{q}?word={q}&order=date_d&mode=safe&p={p}"
                f"&s_mode=s_tag&type=illust")["illustManga"]
        if p == 1:
            print(f"{tag}: {b['total']} works", file=sys.stderr)
        data = [x for x in b["data"] if "id" in x]
        if not data:
            break
        out += [x for x in data if x.get("aiType") != 2 and x.get("illustType") == 0]
        time.sleep(0.3)
    return [x["id"] for x in out]


def details(ids):
    def one(i):
        try:
            d = get(f"{BASE}/illust/{i}")
        except Exception:  # noqa: BLE001
            return None
        return dict(id=i, title=d["title"], user=d["userName"], userId=d["userId"],
                    w=d["width"], h=d["height"], bm=d["bookmarkCount"], pages=d["pageCount"],
                    ai=d.get("aiType"), date=d["createDate"][:10],
                    tags=[t["tag"] for t in d["tags"]["tags"]], urls=d["urls"],
                    url=f"https://www.pixiv.net/artworks/{i}")
    with ThreadPoolExecutor(5) as ex:
        rows = [r for r in ex.map(one, ids) if r and r["ai"] != 2]
    return sorted(rows, key=lambda r: -r["bm"])


def artist_ids(artwork_id, must):
    uid = get(f"{BASE}/illust/{artwork_id}")["userId"]
    ids = list(get(f"{BASE}/user/{uid}/profile/all")["illusts"].keys())
    keep = []
    for k in range(0, len(ids), 48):
        q = "&".join("ids[]=" + i for i in ids[k:k + 48])
        works = get(f"{BASE}/user/{uid}/profile/illusts?{q}&work_category=illust&is_first_page=0")["works"]
        keep += [w["id"] for w in works.values() if not must or any(must in t for t in w["tags"])]
        time.sleep(0.3)
    print(f"user {uid}: {len(ids)} works, {len(keep)} match", file=sys.stderr)
    return keep


def download(rows, outdir, size):
    os.makedirs(outdir, exist_ok=True)

    def one(r):
        path = os.path.join(outdir, f"{r['id']}{os.path.splitext(r['urls'][size])[1]}")
        if not os.path.exists(path):
            res = S.get(r["urls"][size], timeout=60)
            res.raise_for_status()
            with open(path, "wb") as f:
                f.write(res.content)
        return path
    with ThreadPoolExecutor(6) as ex:
        for p in ex.map(one, rows):
            print(p)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("search"); s.add_argument("out"); s.add_argument("tags", nargs="+")
    s.add_argument("--pages", type=int, default=3)
    a = sub.add_parser("artist"); a.add_argument("out"); a.add_argument("artwork_id")
    a.add_argument("--must", default="")
    d = sub.add_parser("dl"); d.add_argument("inp"); d.add_argument("outdir")
    d.add_argument("--top", type=int, default=40)
    d.add_argument("--size", default="regular", choices=["small", "regular", "original"])
    args = ap.parse_args()

    if args.cmd == "dl":
        download(json.load(open(args.inp))[:args.top], args.outdir, args.size)
        return
    if args.cmd == "search":
        ids = list(dict.fromkeys(i for t in args.tags for i in search_ids(t, args.pages)))
    else:
        ids = artist_ids(args.artwork_id, args.must)
    rows = details(ids)
    json.dump(rows, open(args.out, "w"), ensure_ascii=False, indent=1)
    for r in rows[:40]:
        print(r["bm"], r["id"], f"{r['w']}x{r['h']}", r["user"], r["title"][:30])


if __name__ == "__main__":
    main()
