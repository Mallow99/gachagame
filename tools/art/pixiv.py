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
  pixiv.py picker OUTDIR UNIT_ID --tags "tag" ["tag" ...] # searchable click-to-pick page
  pixiv.py picker OUTDIR UNIT_ID --artist ARTWORK_ID [--must マリオ]
  pixiv.py picker OUTDIR UNIT_ID --input RESULTS.json      # rebuild without another search

Useful tags for Mario: マリオ, マリオ(スーパーマリオ), スーパーマリオ, マリオ 100users入り,
マリオ1000users入り, スーパーマリオブラザーズワンダー 100users入り. Chinese: 马里奥, 马力欧.
Tag searches are AND-ed with spaces. Works Pixiv flags as AI-generated (aiType 2) are dropped.
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import requests

S = requests.Session()
S.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126 Safari/537.36",
    "Referer": "https://www.pixiv.net/",
})
S.verify = os.environ.get("REQUESTS_CA_BUNDLE", True)
BASE = "https://www.pixiv.net/ajax"
HERE = Path(__file__).resolve().parent


def get(url, tries=4):
    for i in range(tries):
        try:
            r = S.get(url, timeout=30)
            r.raise_for_status()
            return r.json()["body"]
        except requests.HTTPError as exc:
            if exc.response is not None and exc.response.status_code in {401, 403}:
                raise RuntimeError(
                    "Pixiv refused this network (HTTP 403). Retry on the owner's normal connection "
                    "or rebuild a previous results.json with `pixiv.py picker ... --input`."
                ) from exc
            if i == tries - 1:
                raise
            time.sleep(2 + 2 * i)
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


def image_suffix(url):
    suffix = Path(urllib.parse.urlparse(url).path).suffix.lower()
    return suffix if suffix in {".jpg", ".jpeg", ".png", ".gif", ".webp"} else ".jpg"


def download_thumbnails(rows, outdir):
    """Download browser-friendly local thumbnails and return picker rows."""
    thumbdir = Path(outdir) / "thumbs"
    thumbdir.mkdir(parents=True, exist_ok=True)

    def one(row):
        copy = dict(row)
        url = row["urls"]["small"]
        name = f"{row['id']}{image_suffix(url)}"
        path = thumbdir / name
        if not path.exists():
            res = S.get(url, timeout=60)
            res.raise_for_status()
            path.write_bytes(res.content)
        copy["thumb"] = f"thumbs/{name}"
        return copy

    with ThreadPoolExecutor(6) as ex:
        return list(ex.map(one, rows))


def picker_html(payload):
    template = (HERE / "picker.html").read_text(encoding="utf-8")
    data = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    # A title or artist name must never be able to close the script element.
    data = data.replace("</", "<\\/").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    marker = "__PIXIV_PICKER_DATA__"
    if template.count(marker) != 1:
        raise RuntimeError(f"picker template must contain exactly one {marker} marker")
    return template.replace(marker, data)


def build_picker(rows, outdir, unit_id, label, limit=60):
    """Create a self-contained local review page from ranked Pixiv results."""
    if not re.fullmatch(r"[a-z0-9][a-z0-9_-]*", unit_id):
        raise ValueError("UNIT_ID must use lowercase letters, numbers, hyphens or underscores")
    if limit < 1:
        raise ValueError("--limit must be at least 1")
    out = Path(outdir)
    out.mkdir(parents=True, exist_ok=True)
    ranked = download_thumbnails(rows[:limit], out)
    payload = {"schema": 1, "unitId": unit_id, "label": label, "results": ranked}
    (out / "results.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (out / "index.html").write_text(picker_html(payload), encoding="utf-8")
    print(f"Picker ready: {out / 'index.html'} ({len(ranked)} works)")


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
    p = sub.add_parser("picker")
    p.add_argument("outdir")
    p.add_argument("unit_id")
    source = p.add_mutually_exclusive_group(required=True)
    source.add_argument("--tags", nargs="+")
    source.add_argument("--artist")
    source.add_argument("--input")
    p.add_argument("--must", default="")
    p.add_argument("--pages", type=int, default=3)
    p.add_argument("--limit", type=int, default=60)
    args = ap.parse_args()

    if args.cmd == "dl":
        download(json.load(open(args.inp))[:args.top], args.outdir, args.size)
        return
    if args.cmd == "picker":
        if args.input:
            source_data = json.load(open(args.input, encoding="utf-8"))
            rows = source_data.get("results", source_data) if isinstance(source_data, dict) else source_data
            label = f"Saved results · {Path(args.input).name}"
        elif args.tags:
            ids = list(dict.fromkeys(i for t in args.tags for i in search_ids(t, args.pages)))
            rows = details(ids)
            label = "Tags · " + " + ".join(args.tags)
        else:
            ids = artist_ids(args.artist, args.must)
            rows = details(ids)
            label = f"Artist portfolio · artwork {args.artist}" + (f" · matching {args.must}" if args.must else "")
        build_picker(rows, args.outdir, args.unit_id, label, args.limit)
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
