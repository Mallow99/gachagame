# Skills in this folder

`.agents/skills/` is the shared skill folder: Codex reads it natively, and Claude Code reads it through the
`.claude/skills` symlink. Each skill is a folder with a `SKILL.md` in the open Agent Skills format.

| Skill | Origin | License |
| --- | --- | --- |
| `pocket-gacha-verify`, `splash-rig`, `owner-review` | Written for this repo | Repo |
| `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-help` | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) `skills/` at commit `84740e3` (v5.2.0) | MIT, copy in each folder |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) `skills/frontend-design` at commit `dbd4588` | Apache-2.0, `LICENSE.txt` |

Left out on purpose: ponytail's lifecycle hooks and its `ponytail-gain` benchmark card, and Anthropic's
`webapp-testing`, which assumes Python Playwright. `pocket-gacha-verify` covers testing for this Node repo.

**Updating a vendored skill:** clone the upstream repo, copy the skill folder over this one, update the commit above,
and keep the license file. The vendored `ponytail-help` was edited to describe this copy; re-apply that edit.

**Ponytail always-on mode:** the vendored skills work when invoked or when a task matches them. For the plugin's
automatic per-session activation, each person can install the plugin for their own account:
`/plugin marketplace add DietrichGebert/ponytail` then `/plugin install ponytail@ponytail` in Claude Code, or
`codex plugin marketplace add DietrichGebert/ponytail` then `codex plugin add ponytail@ponytail` in Codex (trust its
hooks in `/hooks`). If you do, the vendored copies and the plugin's copies will both be listed.
