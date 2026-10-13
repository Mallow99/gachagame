"""Validate manual sprite intake for the sprite-first production batch.

The Spriters Resource files are downloaded by the owner into ``incoming/``.
This tool deliberately does not scrape or bypass the site's human check.

Usage:
  python3 tools/art/sprites.py status
  python3 tools/art/sprites.py status --json
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_MANIFEST = Path(__file__).with_name("sprite-batch.json")
DEFAULT_INCOMING = ROOT / "incoming"


def load_manifest(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if data.get("schema") != 1 or not isinstance(data.get("units"), list):
        raise ValueError("sprite batch must use schema 1 and contain a units list")
    seen = set()
    for unit in data["units"]:
        uid = unit.get("id", "")
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", uid) or uid in seen:
            raise ValueError(f"invalid or duplicate unit id: {uid!r}")
        seen.add(uid)
        source = unit.get("source", {})
        if not source.get("url", "").startswith("https://"):
            raise ValueError(f"{uid}: source URL must be https")
        if unit.get("delivery") == "manual_download" and not unit.get("expectedFile"):
            raise ValueError(f"{uid}: manual downloads need expectedFile")
    return data


def intake_status(manifest, incoming):
    rows = []
    for unit in manifest["units"]:
        expected = unit.get("expectedFile", "")
        path = Path(incoming) / expected if expected else None
        ready = unit.get("delivery") == "already_processed" or bool(path and path.is_file())
        rows.append({
            "id": unit["id"],
            "name": unit["name"],
            "role": unit["role"],
            "ready": ready,
            "file": str(path) if path else "already processed",
            "source": unit["source"]["url"],
        })
    return rows


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    status = sub.add_parser("status")
    status.add_argument("--manifest", default=str(DEFAULT_MANIFEST))
    status.add_argument("--incoming", default=str(DEFAULT_INCOMING))
    status.add_argument("--json", action="store_true")
    args = parser.parse_args()

    rows = intake_status(load_manifest(args.manifest), args.incoming)
    if args.json:
        print(json.dumps(rows, indent=2))
        return
    ready = sum(row["ready"] for row in rows)
    print(f"Sprite intake: {ready}/{len(rows)} ready")
    for row in rows:
        mark = "READY" if row["ready"] else "NEEDS DOWNLOAD"
        print(f"{mark:14} {row['id']:15} {row['file']}")


if __name__ == "__main__":
    main()
