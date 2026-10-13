---
'@haus23/tipprunde-model': minor
'@haus23/tipprunde-hinterhof': patch
---

Keep missing extra points empty instead of writing 0 for every player: ranking entries no longer carry `extraPoints`, and hinterhof saves extra points itself. An empty field removes the extra points of a player, and only whole numbers from 0 are accepted.
