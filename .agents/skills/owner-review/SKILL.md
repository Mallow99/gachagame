---
name: owner-review
description: Run Pocket Gacha's owner feedback loop. Ship small labelled visual iterations, record the owner's verdict, and hand off cleanly to the next agent. Use when publishing an iteration for review, receiving owner feedback, or ending a session.
---

# Owner review loop

The owner is the only judge of look and feel. They dislike long invisible work, repeated permission questions, and
sessions that end on research with nothing to see.

1. **Show something within the session.** Build one bounded proof, verify it (`pocket-gacha-verify`), and publish
   it with a visible version label such as "Dedede reveal · v3". Hosting that worked: claude.ai artifacts (built with
   `node tools/splash-kit/export-artifact.mjs <dir>`), and the private review site in
   `docs/PRIVATE_REVIEW_HOSTING.md`. Raw HTML file attachments in chat did not work for the owner.
2. **Talk briefly and often.** Give one-line progress notes while working, not a wall of text at the end.
3. **Record the verdict word for word** in the demo's `FEEDBACK.md`, as Liked, Disliked and Still needed.
   "Right direction" is not approval. When the owner repeats a complaint, the last fix was too narrow: read it as
   broadly as they meant it.
4. **Hand off.** Update the top section of `docs/NEXT_CHAT.md` with the branch, the verdict, how the work was built,
   and the next steps in order. Commit and push to `codex/v1-playable` unless told otherwise.
