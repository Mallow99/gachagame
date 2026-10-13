# Manual sprite intake

Put browser-downloaded sprite sheets here using the exact filenames from
`tools/art/sprite-batch.json`:

```text
incoming/
  mario.png
  kirby.png
  sonic.png
  mega-man-x.png
  link.png
  samus.png
  ryu.png
  cuphead.zip
  shovel-knight.zip
  alucard.png
  susie.png
  bowser.png
```

The Spriters Resource uses a human check, so these files are deliberately
manual downloads. Do not commit raw downloads: everything in this directory
except this README is ignored. The import tool will copy only the selected,
optimized frames into tracked character folders and preserve the source URL in
the unit's metadata.

Check progress with:

```bash
python3 tools/art/sprites.py status
```
