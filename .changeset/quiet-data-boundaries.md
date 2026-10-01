---
'@haus23/tipprunde-hinterhof': patch
'lib': patch
---

Load master data at the application shell and championship data only within
current-data routes. Keep the router mounted while championship data changes
and surface initial Firestore subscription failures through route boundaries.
