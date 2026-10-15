---
name: pocket-gacha-verify
description: Verify a Pocket Gacha change before pushing or showing the owner. Runs the Node test suite, then opens the page in headless Chromium and checks real screenshots. Use after any change to game code, summon or splash presentation, demos, or UI.
---

# Verify a Pocket Gacha change

The owner judges by what they see, so passing tests are not enough. Look at frames before claiming something works.

1. **Tests.** Run `npm test`. If your Node rejects `--test-isolation`, run `node --test test/*.test.js` instead. Both
   must end with `fail 0`.
2. **Serve.** Run `npm run web` in the background; it serves the repo root at http://localhost:8080.
3. **Capture.**
   `node .agents/skills/pocket-gacha-verify/scripts/capture.mjs <url> <out-dir> [--state banner] [--shots 3] [--every 1500] [--width 420]`
   - It launches Chromium with SwiftShader so WebGL works headless. Point `POCKET_PLAYWRIGHT_MODULE` at Playwright if
     it is not installed where Node can find it. The repo's other browser checks (`tools/browser-*.mjs`) use the same
     variable.
   - Open every PNG and look at it. Confirm the output reports `no page errors` and that `scrollWidth` equals the
     viewport width.
4. **Timed scenes.** Software GL runs slowly, so wall-clock waits drift. Wait on DOM state (for example
   `#stage[data-state]`) rather than sleeping. Check animation through deterministic renderers: the splash kit's
   `summonRenderer(canvas, opts).render(t)` draws any moment of the summon.
5. **Check list.**
   - Hidden overlays really are hidden. A `display` rule overriding `[hidden]` caused a real bug here.
   - No console errors.
   - Phone width (about 420 px) has no sideways scroll.
   - `prefers-reduced-motion` still reaches the result.
   - Skip and replay never change a committed pull.

Report exactly what you checked and what you could not, such as audio, real GPU performance, or a native M2 run.
