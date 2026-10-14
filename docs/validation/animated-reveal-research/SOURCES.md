# Animated-art research sources

The owner-facing review is owner-private. References are examples, not
production game assets. No game saves or RNG are loaded by these pages.

## Phantom Parade clips

The seven source pages and exact public movie/poster URLs are recorded in
`cards.json`, with hashes and sizes. Files were obtained from public preview
assets on `https://phantom-parade-database.vercel.app`.

Jujutsu Kaisen: Phantom Parade © Gege Akutami / Shueisha / Jujutsu Kaisen
Production Committee; © Sumzap / TOHO. The database is an unofficial source.
Original card loop previews were preserved. `*-frames.jpg` are sampled-frame
contact sheets produced with ffmpeg for movement inspection; they are not
new artwork or reconstructed rigs.

## Cubism technical sample

- Haru model, textures, physics, pose, expressions and motions:
  https://github.com/Live2D/CubismWebSamples/tree/5-r.5/Samples/Resources/Haru
- Cubism Core: official versioned download from
  https://cubism.live2d.com/sdk-web/core/05/live2dcubismcore.min.js,
  referenced by the official download script at
  https://cubism.live2d.com/sdk-web/js/download.js.
- SDK download/terms: https://www.live2d.com/en/sdk/download/web/
  and https://www.live2d.com/en/sdk/license/.
- Core’s proprietary agreement is retained as `cubism/vendor/core-license.txt`
  (the downloaded HTML, despite its `.txt` suffix). Canonical agreement:
  https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html
- Sample material terms:
  https://www.live2d.com/eula/live2d-free-material-license-agreement_en.html
  and https://www.live2d.com/en/learn/sample/.
- PixiJS 6.5.10 and pixi-live2d-display 0.4.0 from the matching jsDelivr npm
  distributions. Both projects use the MIT license. The adapter contains the
  Cubism 4 framework; it is not the current official 5.3 Web Framework.
  Their license files and the official SDK license/notices are retained in
  `cubism/vendor/`. `cubism/INTAKE.json` records the local files' hashes and sizes.

All Haru artwork belongs to Live2D Inc. The review JSON removes only sample
voice references; the compiled model, textures, motions and physics are not
authored by this project. The gesture/expression buttons use its existing
motions and expressions. This is a runtime test, not new game character art.

The failed latest-Core/older-adapter combination was corrected before
publication. `cubism-results.json` records the actual browser result. Its
screenshots are verification captures of the rendered official sample.
