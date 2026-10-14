---
'@haus23/tipprunde-hinterhof': patch
---

Fix endless Firestore requests after a failed load (e.g. switching the championship while offline): the failure is kept and shown on the error page until a reload.
