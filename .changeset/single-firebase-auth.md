---
'@haus23/tipprunde-hinterhof': patch
'lib': patch
---

Remove the obsolete shared authentication export so the Hinterhof initializes
Firebase Auth exactly once with its local persistence configuration.
