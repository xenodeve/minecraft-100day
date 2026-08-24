---
name: config-and-kubejs-fail-open
description: A typo'd config key and a broken KubeJS script both fail silently in this pack, so reasoning about a change is never evidence it worked
type: feedback
---

This pack has no fail-fast layer. Two mechanisms swallow errors:

- **Mod configs fail open.** An unrecognised key is ignored rather than rejected. A typo and a
  working setting produce identical logs, so a config change that "looks right" is
  indistinguishable from one that does nothing.
- **KubeJS drops broken files whole.** A syntax error does not crash the pack; it is logged and
  the file is skipped, removing every recipe it defined. The first symptom is usually a recipe
  that is simply absent, discovered sessions later.

`scripts/validate/verify.mjs` catches the second one (`node --check` over `kubejs/**/*.js`).
Nothing catches the first except launching the game and observing the effect.

**Why:** in most repos a wrong change fails loudly and cheaply. Here it fails quietly and the
cost is paid much later by whoever is debugging something unrelated. The usual agent habit —
make the change, reason that it is correct, report it as done — produces confident false
reports in this repo specifically.

**How to apply:** never write "configured X" or "fixed Y" for a config or KubeJS change that has
not been observed taking effect in a launched world. Say "changed, not yet verified in game"
instead. Related: [[measure-before-you-write-a-number]].
