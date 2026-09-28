# @haus23/tipprunde-unterbau

Backend-Server der Haus23 Tipprunde. Der Unterbau liest die in Firestore
gespeicherten Turnierdaten, führt zusammengehörige Dokumente zusammen und
stellt sie Frontend-Clients als JSON zur Verfügung.

Der Server basiert auf Express und Firebase Admin. Die Daten werden an den
Grenzen zu Firestore und zur öffentlichen API mit den Valibot-Schemas aus
`@haus23/tipprunde-model` validiert und normalisiert.

## Aufgaben

Der Unterbau übernimmt:

- das Lesen der Stammdaten und Turnier-Subcollections aus Firestore
- das Zusammenführen von Daten für die Ansichten der Frontend-Clients
- die Laufzeitvalidierung der Firestore-Dokumente und API-Antworten
- das Caching aktiver und abgeschlossener Turniere
- eine authentifizierte Cache-Invalidierung für den Hinterhof
- die Bereitstellung einer öffentlichen OpenAPI-Beschreibung

Der Server verändert selbst keine Turnierdaten in Firestore. Schreibzugriffe
erfolgen durch den Hinterhof.

## Öffentliche API

Die öffentliche API ist nur lesend und liegt unter `/api/v1`. Sie umfasst die
Stammdaten sowie die für Frontend-Ansichten aufbereiteten Turnierdaten.

| Ressource | Beschreibung |
| --- | --- |
| `/api/v1/accounts` | Mitglieder der Tipprunde |
| `/api/v1/championships` | veröffentlichte Turniere |
| `/api/v1/leagues` | Ligen |
| `/api/v1/rules` | Regelwerke |
| `/api/v1/teams` | Teams |
| `/api/v1/championships/{id}/players` | Teilnehmer und Ranking eines Turniers |
| `/api/v1/championships/{id}/matches` | Runden, Spiele und verwendete Stammdaten |
| `/api/v1/championships/{id}/current-tips` | aktueller Ausschnitt aus Spielen und Tipps |
| `/api/v1/championships/{id}/player-tips` | Tipps eines Teilnehmers |
| `/api/v1/championships/{id}/match-tips` | Tipps eines Spiels |

Die vollständigen Parameter, Statuscodes und Antwortmodelle sind in der
integrierten API-Dokumentation beschrieben:

- `/docs` – interaktive Scalar API Reference
- `/openapi.json` – OpenAPI 3.1.1

Die Response-Schemas der OpenAPI-Beschreibung werden aus den kanonischen
Valibot-Schemas des Model-Pakets erzeugt. HTTP-Pfade, Parameter und Fehlerfälle
werden im Unterbau ergänzt.

Die E-Mail-Adresse eines Mitglieds dient ausschließlich Benachrichtigungen und
darf von öffentlichen Frontend-Clients nicht angezeigt werden.

## Datenfluss und Validierung

Eine öffentliche Anfrage durchläuft im Wesentlichen folgende Schritte:

1. Der Query-Layer liest die benötigten Firestore-Collections.
2. Der Firestore Model Converter validiert und normalisiert jedes Dokument.
3. Der jeweilige Handler führt zusammengehörige Daten zusammen.
4. Zusammengesetzte Antworten werden erneut gegen ihren API-Vertrag validiert.
5. Die normalisierte Antwort wird als JSON ausgeliefert.

Nicht mehr unterstützte Eigenschaften historischer Firestore-Dokumente werden
beim Parsen entfernt. Ungültige Daten führen zu einer kontrollierten
Serverantwort und werden nicht ungeprüft an Clients weitergegeben.

## Cache

Der Query-Layer verwendet `unstorage`:

- Daten aktiver Turniere und Stammdaten liegen in Production im Arbeitsspeicher
  und laufen nach `MAX_AGE` Sekunden ab.
- Daten abgeschlossener Turniere liegen im Dateisystem unter `.cache/archive`
  und laufen nicht automatisch ab.
- In der lokalen Entwicklung wird auch der reguläre Cache im Dateisystem unter
  `.cache` gespeichert.

Der Hinterhof kann betroffene Cache-Einträge nach einer erfolgreichen
Firestore-Änderung gesammelt invalidieren. Dieser interne Endpunkt gehört
bewusst nicht zur öffentlichen OpenAPI-Beschreibung:

```text
POST /api/cache/invalidate
Authorization: Bearer <Firebase-ID-Token>
```

Der Token wird mit Firebase Admin geprüft. Zusätzlich muss seine Nutzer-UID in
`CACHE_INVALIDATION_ALLOWED_UIDS` enthalten sein. Die Antwort enthält die
tatsächlich entfernten Cache-Schlüssel.

## Konfiguration

Der Server benötigt folgende Umgebungsvariablen:

| Variable | Bedeutung |
| --- | --- |
| `PORT` | HTTP-Port des Express-Servers |
| `MAX_AGE` | Lebensdauer regulärer Cache-Einträge in Sekunden |
| `FIREBASE_PROJECT_ID` | Firebase-Projekt-ID |
| `FIREBASE_CLIENT_EMAIL` | Client-E-Mail des Firebase-Service-Accounts |
| `FIREBASE_PRIVATE_KEY` | privater PEM-Schlüssel des Service-Accounts |
| `CACHE_INVALIDATION_ALLOWED_UIDS` | kommaseparierte Firebase-Auth-UIDs der berechtigten Administratoren |

Die Konfiguration wird beim Start mit Valibot geprüft. Der Server startet nicht
mit fehlenden oder ungültigen Werten.

## Lokale Entwicklung

Abhängigkeiten aus dem Repository-Root installieren:

```sh
pnpm install
```

Eine passende `.env` im App-Verzeichnis bereitstellen und den Entwicklungsserver
starten:

```sh
pnpm --filter=@haus23/tipprunde-unterbau dev
```

Der Server verwendet standardmäßig den in `PORT` konfigurierten Port. Bei der
üblichen lokalen Konfiguration sind Startseite und Dokumentation erreichbar
unter:

```text
http://localhost:26515/
http://localhost:26515/docs
http://localhost:26515/openapi.json
```

## Prüfung

TypeScript prüfen:

```sh
pnpm --filter=@haus23/tipprunde-unterbau typecheck
```

Tests einmalig ausführen:

```sh
CACHE_INVALIDATION_ALLOWED_UIDS=test-admin \
  pnpm --filter=@haus23/tipprunde-unterbau test --run
```

Die Test-Suite verwendet für die Cache-Autorisierung die simulierte UID
`test-admin`. Die übrigen erforderlichen Umgebungsvariablen werden weiterhin
aus der lokalen `.env` gelesen.

## Docker

Das Docker-Image wird mit dem Repository-Root als Build Context gebaut, weil
der Unterbau das interne Model- und TypeScript-Konfigurationspaket benötigt:

```sh
docker build \
  --file apps/unterbau/Dockerfile \
  --tag unterbau \
  .
```

Das Image basiert auf dem pnpm-Image, installiert seine Node.js-Runtime über
pnpm und startet den TypeScript-Server mit `tsx`. Der Container stellt Port
`26515` bereit; die tatsächliche Bindung wird über `PORT` und die
Container-Konfiguration festgelegt.

## Versionierung

Mit Version 1.0.0 gelten die öffentliche Lese-API, ihre validierten Verträge,
das Cache-Verhalten und die geschützte Invalidierungs-API als stabile
Schnittstellen. Änderungen werden über Changesets versioniert.
