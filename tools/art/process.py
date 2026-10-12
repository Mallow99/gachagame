"""Turn picks.json into game-ready assets.

For each character: optional crop, background removal (rembg) or keep-bg,
trim to content, then export
  OUT/<id>/splash.webp   up to 900px tall (pull reveal / detail panel)
  OUT/<id>/battle.webp   220px tall (battle screen)
  OUT/<id>/icon.webp     160x160 face/upper-body crop (collection grid)
Usage: process.py OUTDIR [ids...]
"""
import json
import os
import sys

from PIL import Image
from rembg import new_session, remove

HERE = os.path.dirname(os.path.abspath(__file__))
PHOTO = {"walter", "jesse", "saul", "tyler", "bateman", "chigurh", "hansen", "ronald", "grimace",
         "koolaid", "cap", "sole", "mrclean", "keebler"}
_sessions = {}


def session(name):
    if name not in _sessions:
        _sessions[name] = new_session(name)
    return _sessions[name]


def trim(im, pad=6):
    if im.mode != "RGBA":
        return im
    bbox = im.getchannel("A").point(lambda a: 255 if a > 12 else 0).getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


def fit_h(im, h):
    if im.height <= h:
        return im
    return im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)


def icon(im, size=160, keepbg=False):
    w, h = im.size
    side = min(w, int(h * 0.55)) if not keepbg else min(w, h)
    left = (w - side) // 2
    top = 0 if not keepbg else max(0, (h - side) // 3)
    crop = im.crop((left, top, left + side, top + side))
    return crop.resize((size, size), Image.LANCZOS)


def process(cid, spec, outdir):
    if "combine" in spec:
        parts = []
        for path in spec["combine"]:
            part = Image.open(os.path.join(HERE, path)).convert("RGBA")
            parts.append(trim(remove(part, session=session("isnet-anime"))))
        h = max(x.height for x in parts)
        parts = [x.resize((round(x.width * h / x.height), h), Image.LANCZOS) for x in parts]
        im = Image.new("RGBA", (sum(x.width for x in parts) - 20 * (len(parts) - 1), h), (0, 0, 0, 0))
        x0 = 0
        for part in parts:
            im.alpha_composite(part, (x0, 0))
            x0 += part.width - 20
        spec = {**spec, "cut": False}
    else:
        im = Image.open(os.path.join(HERE, spec["splash"]))
        im.seek(0)
        im = im.convert("RGBA")
    if "crop" in spec:
        l, t, r, b = spec["crop"]
        im = im.crop((int(l * im.width), int(t * im.height), int(r * im.width), int(b * im.height)))
    if spec.get("cut"):
        model = "isnet-general-use" if cid in PHOTO else "isnet-anime"
        im = remove(im, session=session(model))
    if not spec.get("keepbg"):
        im = trim(im)
    d = os.path.join(outdir, cid)
    os.makedirs(d, exist_ok=True)
    fit_h(im, 900).save(os.path.join(d, "splash.webp"), quality=88)
    fit_h(im, 220).save(os.path.join(d, "battle.webp"), quality=90)
    icon(im, keepbg=spec.get("keepbg", False)).save(os.path.join(d, "icon.webp"), quality=90)
    return im.size


if __name__ == "__main__":
    outdir, *ids = sys.argv[1:]
    picks = json.load(open(os.path.join(HERE, "picks.json")))
    for cid in ids or list(picks):
        try:
            size = process(cid, picks[cid], outdir)
            print(f"{cid:16s} ok {size}")
        except Exception as e:  # noqa: BLE001
            print(f"{cid:16s} FAIL {e}")
