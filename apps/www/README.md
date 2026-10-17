# Projekt: @haus23/tipprunde-www

> Haus23 Tipprunde Legacy Frontend

## Release Stopper

- Linting, CSS Sorting, ...
- Scrollrestauration ?
- Remove query logs (backend/queries)
- Performance/A11y/SEO
  - Need to check all pages (/spieler)

## Future

...

## Gerätedaten

Mit `VITE_DEVICE_METRICS=on` meldet die Seite einmal pro Sitzung die
Eigenschaften des Geräts an den Unterbau (`POST /api/metrics/device`):
Bildschirm- und Fenstergrößen, Eingabearten, Nutzereinstellungen, Anzeige,
Sprache und User-Agent. Eine zufällige ID im `localStorage` hält das Gerät
über Sitzungen hinweg fest.

Ohne die Variable enthält der Build keinen Tracking-Code. Ein- und
Ausschalten heißt also: Variable bei Cloudflare Pages ändern und neu bauen.
