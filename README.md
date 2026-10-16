# Projekt: tipprunde-legacy

> Monorepo mit den Legacy-Projekten der Haus23 Tipprunde.

Die Projekte sind fertig und werden nur noch gepflegt. Die Neufassung entsteht
im Projekt `tipprunde`.

## Inhalt

| Verzeichnis | Paket | Aufgabe |
| --- | --- | --- |
| `apps/www` | `@haus23/tipprunde-www` | Öffentliche Website [runde.tips](https://www.runde.tips): Tabelle, Tipps der Spieler, Tipps zu den Spielen |
| `apps/hinterhof` | `@haus23/tipprunde-hinterhof` | Admin-Website zum Pflegen von Turnieren, Spielen, Tipps und Stammdaten in Firestore |
| `apps/unterbau` | `@haus23/tipprunde-unterbau` | Backend-Server: liest die Daten aus Firestore und stellt sie als JSON-API bereit (Docker) |
| `packages/model` | `@haus23/tipprunde-model` | Gemeinsames Domain-Modell mit den Valibot-Schemas |
| `packages/tsconfig` | `@haus23/tipprunde-tsconfig` | Gemeinsame TypeScript-Konfiguration |

Details stehen in den READMEs der einzelnen Pakete.

## Voraussetzungen

- Node.js in der Version aus `.node-version`
- pnpm in der Version aus `packageManager` in `package.json`

## Einrichtung

```bash
pnpm install
```

Jede App braucht eine eigene `.env`. Die nötigen Variablen stehen in der
jeweiligen `.env.dist`.

## Befehle

Alle Befehle laufen im Wurzelverzeichnis und werden über Turborepo verteilt.

| Befehl | Wirkung |
| --- | --- |
| `pnpm www` | Dev-Server der Website (Port 5173) |
| `pnpm hinterhof` | Dev-Server der Admin-Website |
| `pnpm unterbau` | Backend-Server im Watch-Modus |
| `pnpm build` | Alle Apps bauen |
| `pnpm typecheck` | TypeScript in allen Paketen prüfen |
| `pnpm test` | Tests (Vitest, im Watch-Modus) |
| `pnpm lint` | Biome prüfen und Fundstellen korrigieren |

Die Tests des Unterbaus brauchen eine Test-UID für die Cache-Invalidierung:

```bash
CACHE_INVALIDATION_ALLOWED_UIDS=test-admin pnpm --filter @haus23/tipprunde-unterbau test
```

## Branches und Deployments

- `main` ist der einzige dauerhafte Branch und wird produktiv ausgeliefert.
- Änderungen entstehen auf Feature-Branches. Cloudflare Pages baut für jeden
  gepushten Branch eine Vorschau, für die Website unter
  `https://<branch>.tipprunde-www.pages.dev/`.
- Nach der Prüfung in der Vorschau wird der Feature-Branch nach `main`
  gemergt.

## Releases

Versionen und Changelogs entstehen mit [Changesets](https://github.com/changesets/changesets).

1. Zu jeder sichtbaren Änderung ein Changeset anlegen: `pnpm changeset`
2. Zum Release auf `main`: `pnpm changeset version` und das Changelog prüfen
3. Release-Commit, dann `pnpm changeset git-tag`
4. `git push --follow-tags origin main`

## Lizenz

[MIT](LICENSE)
