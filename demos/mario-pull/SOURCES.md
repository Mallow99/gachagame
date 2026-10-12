# Mario pull demo asset notes

No AI-generated artwork is used in this demo.

Reveal art (one hand-drawn piece per pull, fan art from Pixiv, used for this
private demo only; many of these artists prohibit reposting):

| File | Artist | Source |
|---|---|---|
| `pull-superstar.webp` | 者委任具ハチナナ | https://www.pixiv.net/artworks/107788642 |
| `pull-flower.webp` | maribou | https://www.pixiv.net/artworks/109312593 |
| `pull-bubble.webp` | yamari | https://www.pixiv.net/artworks/115315568 |
| `pull-block.webp` | しかばね | https://www.pixiv.net/artworks/107605604 (border cropped) |
| `pull-wonder.webp` | すびかか | https://www.pixiv.net/artworks/109278469 |
| `pull-fludd.webp` | ゴンザレス | https://www.pixiv.net/artworks/99850736 |

- `bg.webp` and `mario.webp` are the online-sourced Nintendo artwork retained
  from take 2. The project handoff records the Super Mario Wiki API as the art
  source used for the demo, but the original commit did not retain per-file
  page URLs.
- `coin.mp3`, `letsago.mp3`, and `powerup.mp3` are the existing online clips
  retained from take 2; `HANDOFF.md` records Myinstants as their source.
- `mus-starman.mp3` (SSR only): https://www.myinstants.com/media/sounds/super-mario-bros-nes-music-star-theme-cut-mp3.mp3,
  trimmed and loudness-normalised with ffmpeg.
- `superstar.webp` (the Super Star the SSR meteor turns into): Super Mario Wiki,
  `File:NSMBU Super Star Artwork.png`.
- The bundled Lilita One and Barlow Condensed webfonts come from the
  corresponding `@fontsource` 5.3.0 npm packages. Both typefaces are licensed
  under the SIL Open Font License 1.1.

Before public distribution, replace the provisional Nintendo and audio assets
with files whose exact source URLs and reuse terms have been recorded.
