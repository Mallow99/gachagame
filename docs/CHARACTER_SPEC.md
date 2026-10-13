# Character spec: what a "finished" character is

> Presentation checklist only. Roster structure, rarity, Power-Ups, title
> release homes and asset gates now live in [`docs/plan/`](plan/README.md) and
> override older variant examples below where they conflict.

The bar: low-budget, but every pull should feel like a real gacha pull.
This doc is the checklist each batch is built against.

## What real gacha games ship (measured from their wikis)

| Game | Splash art | 10-pull card | Icon | Notes |
|---|---|---|---|---|
| Genshin Impact | ~2000 px, transparent, roughly square (Hu Tao 2153×1772) | 320×1024 tall strip cut from the splash | — | Pull screen is a 2048×1024 (2:1) composition. Effects (fire, butterflies) are painted into the splash. |
| Honkai: Star Rail | 2048×2048 transparent square | — | 160×160 | Character preview card (1080×1600) shows name, stars, element, and a one-line quote. Ability previews are short animated clips. |
| Arknights | 1024×1024 | — | 180×180 | Battle sprites are skeletal (Spine) animations. |

Takeaways:

- **Splash art is the character plus effects.** A clean cutout looks flat. We add a per-character effect layer (aura color, particles, light rays) behind and around the cutout.
- **One splash makes everything else.** The 10-pull card is a tall crop of the splash, and the icon is a face crop.
- **The quote sits on the reveal.** A short line in quotes under the name.

## The pull sequence (target)

1. Orb or meteor tease, with color showing the rarity (we have this).
2. Cut to black, about 0.6 s.
3. The character's music sting starts, 3–6 s of their theme.
4. Quote text types in on the black screen while the voice line plays.
5. Flash, then the splash art slides or zooms in with the effect layer and a slight idle motion (breathing, parallax, floating particles).
6. Rarity letters slam in one at a time (**S**, **S**, **R**), with stars, name, title and class.
7. NEW! / dupe info. Tap to continue.

Ten-pulls show the strip cards; any SSR in a 10-pull plays the full sequence above.

## Per-character asset checklist

| Asset | Spec | Where it comes from |
|---|---|---|
| Splash | Transparent PNG/WebP, 1000–2000 px tall, full body, dynamic pose | Wikis (official renders), DeviantArt fan art, game rips |
| Effect theme | 1 aura color + particle type (sparks, petals, bubbles, smoke) | Chosen per character, drawn in code |
| Card strip | ~1:3 vertical crop of the splash, centered on face/torso | Generated from the splash |
| Icon | 160×160 face crop | Generated from the splash |
| Battle sprite | Ideal: animated sheet with idle / attack / skill / hurt / KO. Fallback: static cutout animated in code (bob, lunge, squash, flash) | Spriters Resource (you download), Pokémon Showdown, wiki GIFs |
| Quote | One line, ideally a real catchphrase ("Let's-a go!") | Written per character |
| Voice clip | 1–3 s, the quote or a signature sound | Myinstants (meme/voice clips), game rips |
| Theme sting | 3–6 s of their most recognizable music | KHInsider (game soundtracks), clips |
| Kit | Basic attack, Skill, Ultimate, Passive (name + effect + visual) | Written per character |

## Kit structure (Star Rail-style, simplified)

- **Basic attack**: free; builds energy.
- **Skill**: the signature move; uses a shared skill-point pool.
- **Ultimate**: costs full energy; full-screen moment (darken, cut-in of the splash, big effect).
- **Passive**: always-on trait ("Heals the lowest ally when hit").

Visuals per move: actor animation (or code-driven lunge or charge) + a projectile/impact effect + screen shake on ultimates.

## Variants and tiers

One character can have several pull-able versions at different rarities, for example
Mario (R) → Fire / Ice / Tanuki / Propeller / Penguin Mario (SR) → Superstar Mario (SSR).
Each variant is its own entry with its own splash, quote and kit, and shares a "family" tag
(useful later for team bonuses or banners).

## Sources we can and can't reach

| Source | Status |
|---|---|
| Fandom/MediaWiki wikis (API) | ✅ main source for official art |
| DeviantArt (search feed) | ✅ high-quality fan art, direct image links |
| Pokémon Showdown sprites | ✅ animated battle sprites for every Pokémon |
| Myinstants | ✅ voice lines and meme sounds |
| KHInsider | ✅ game music |
| The Spriters Resource / Sounds Resource | ❌ bot check; you download, I process |
| Reddit, X/Twitter | ❌ blocked or login-walled; paste direct image links and I'll take it from there |
