# Dream Land reveal audio

`kirby-adventure-fanfare.mp3` is the short fanfare from **Kirby's Adventure
(NES, 1993)**. Music: **Hirokazu Ando / Jun Ishikawa**, HAL Laboratory / Nintendo.
The NSF recording is hosted by [Zophar's Domain](https://www.zophar.net/music/nintendo-nes-nsf/kirbys-adventure).

The complete downloaded short and long recordings remain in `sources/`, with
URLs and SHA-256 hashes in [INTAKE.json](INTAKE.json). The short recording is
used for the Dream Land Hub's SSR artwork arrival; it is not a character voice
or a claim that every fighter comes from Adventure. The long recording is a
retained comparison candidate and is not played by the game.

The display clip preserves the tune and removes trailing silence, with no
tempo or pitch change. Rebuild it from the original using FFmpeg:

```sh
ffmpeg -y -i assets/audio/reveal/sources/kirby-adventure-fanfare-short.mp3 \
  -t 2.85 -af loudnorm=I=-18:TP=-1.5:LRA=6 -ar 44100 \
  -codec:a libmp3lame -b:a 128k assets/audio/reveal/kirby-adventure-fanfare.mp3
```

The game keeps music, voice and sound-effect volumes independent. Skip, results
and closing the theater stop its native clips and scheduled synth tones. The
browser review verifies native decode/playback and cancellation; it does not
verify speaker quality on the owner's Mac. The flight sting and ordinary
Dream Land rarity chimes remain procedural. Mushroom audio uses the retained
[approved demo sources](../../../demos/mario-pull/SOURCES.md).
