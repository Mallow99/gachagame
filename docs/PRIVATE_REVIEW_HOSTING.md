# Private review: retained source and safe publishing handoff

The review is a separate **owner-private Sites project**; the Electron game is
on GitHub. Do not replace the game with the Site or make the Site public.

- URL: <https://pocket-gacha-reveal-review.berryowlet9.chatgpt.site/>
- Project ID: `appgprj_6acff4c4416081918499004cc7f2fcb4`.
- Existing checkout: `/workspace/sites/gacha-reveal-review`, branch `main`.
- Source remote:
  `https://git.chatgpt-team.site/c8bf81ad-a122-4d5b-9926-dbfc6cb5ea0c/appgprj_6acff4c4416081918499004cc7f2fcb4.git`.
- Deployed source commit: `3ed758afc8001ba925d2d258af8294989ec250a3`.
- Successful version/deployment IDs: `docs/validation/dedede-reveal/deployment.json`.
- Current root: **rejected Dedede iteration 03**. `/motion-references/index.html`
  has the seven actual JJK cards; `/cubism/index.html` has official Haru;
  `/references/index.html` has historical Mario/static comparisons.

No replacement presentation was implemented/published after the owner's latest
rejection. Preserve that fact in the next chat.

## Rebuild without the previous workspace

Everything needed for the current game and all four review pages is in the
GitHub game branch. From a fresh clone:

```sh
node tools/export-review-site.mjs /tmp/pocket-review
```

This produces `.openai/hosting.json` and a self-contained `dist/` with local
assets. The script reuses credited game/demo/research files rather than
duplicating the media in Git. `docs/validation/private-site/asset-map.json`
maps the static reference page's original hashed filenames to retained files.
The Cubism vendor licenses and sample resources are included. This is a local
export: it neither creates a Site nor publishes anything.

To refresh only Dedede in the existing Site checkout, the older
`tools/build-dedede-review.mjs` also remains available. For a complete fresh
reconstruction, use `export-review-site.mjs`.

## Publish an authorized visual iteration

Read the current Sites skill when available and prefer its supported helpers.
Reuse this project ID; **never create a duplicate Site**. Refresh `get_site` to
confirm ownership/audience and request a fresh source write credential for this
same project. The audience was confirmed as custom access with only the owner
allowed; do not copy identities or tokens into the game repository.

Open/synchronize its existing source checkout before editing, export the new
review into it, and package the exact pushed source with the supported helper.
The preceding workspace lacked the installed helper scripts, so a small
equivalent used there is retained as `tools/package-private-review.mjs`.
Use it only if the official helper is still unavailable and its behavior
matches current tool instructions. It packages the existing Site checkout,
verifies the remote branch, commits/pushes only `.openai/hosting.json` and
`dist/`, and creates a deployment archive. It does not deploy by itself.

Launch that fallback with a PTY:

```sh
node /path/to/gachagame/tools/package-private-review.mjs /workspace/sites/gacha-reveal-review
```

After its hidden-stdin prompt, send one JSON object through `write_stdin` with
the native credential object and `project_id`. **Credentials stay in session
memory/stdin, never shell arguments, files, Git, logs or chat output.** Use the
returned verified `project_id`, `commit_sha` and `archive` directly with
`save_version_and_deploy_private` when owner-private access is still confirmed.
Preserve the archive until saving succeeds. Resume an existing saved version
or deployment after an error; do not duplicate it. Poll only nonterminal states.

## Verification and limits

`tools/browser-dedede-reveal.mjs` verifies the old prototype locally. Its
screenshots/results are in `docs/validation/dedede-reveal/`. Authenticated
hosted evidence records actual loading/motion/controls and retained references;
it does not mean the owner approved the illustration, animation or audio.

The prior private-production QA supplied the existing `get_site` QA bearer
server-side using `OAI-Sites-Authorization: Bearer …`, preserved response bytes
and CSP, and followed canonical redirects **only within the same Site origin**.
Never expose that token to page scripts or request a new bypass token without
an explicit user request. Native successful deployment also verifies publication
without a compulsory browser visit. The chat file viewer failed for large HTML;
give the user the actual HTTPS review URL for iterations.

The source repo/hosting manifest contains no account save or credentials. The
game branch's screenshots/intake/deployment metadata are safe provenance;
raw `get_site` and source-credential tool results are not safe to print/commit.
