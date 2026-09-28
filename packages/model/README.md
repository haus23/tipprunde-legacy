# @haus23/tipprunde-model

Gemeinsames Domain-Modell der Haus23 Tipprunde. Das Paket ist die kanonische
Quelle für die fachlichen Datenstrukturen, die Laufzeitvalidierung und die
Firebase-unabhängige Berechnungslogik der Legacy-Anwendungen.

Es wird innerhalb des Monorepos von folgenden Anwendungen und Paketen genutzt:

- `@haus23/tipprunde-hinterhof` zum Lesen und Ändern der Turnierdaten
- `@haus23/tipprunde-unterbau` zum Validieren, Normalisieren und Ausliefern der
  Firestore-Daten
- `@haus23/tipprunde-www` zum Verarbeiten der API-Antworten
- `lib` für die typisierten Firestore-Repositories

Das Paket wird als internes Workspace-Paket verwendet. Es exportiert seinen
TypeScript-Quellcode; die jeweilige Anwendung übernimmt das Transpilieren.

## Inhalt

### Domain-Modelle

Das Paket bildet die fünf Root-Collections aus Firestore ab:

- `championships`
- `leagues`
- `players` als `Member`
- `rules` als `RuleSet`
- `teams`

Zu einem Turnier gehören außerdem die Modelle der Subcollections:

- `Round`
- `Match`
- `ChampionshipPlayer`
- `Tip`

Die Bezeichnung `Member` beschreibt ein Mitglied der Tipprunde. Ein
`ChampionshipPlayer` ist dessen Teilnahme an einem bestimmten Turnier.

### Schemas und Typen

Jedes Domain-Modell besitzt ein Valibot-Schema sowie daraus abgeleitete
Eingabe- und Ausgabetypen:

```ts
import * as v from 'valibot';

import {
  ChampionshipSchema,
  type Championship,
  type ChampionshipInput,
} from '@haus23/tipprunde-model';

const championship: Championship = v.parse(
  ChampionshipSchema,
  input satisfies ChampionshipInput,
);
```

Die Schemas dienen gleichzeitig als Laufzeitgrenze. Beim Parsen werden
Defaultwerte ergänzt und nicht mehr unterstützte Felder aus historischen
Firestore-Dokumenten entfernt. Dazu gehören insbesondere die früher teilweise
gespeicherten `updatedAt`-Felder.

Für IDs gelten unterschiedliche fachliche Regeln:

- IDs der Root-Collections sind Slugs aus Kleinbuchstaben, Ziffern und
  Bindestrichen.
- Turnier-IDs folgen dem eigenen Schema aus zwei Kleinbuchstaben und vier
  Ziffern, zum Beispiel `em2024`.
- IDs der Turnier-Subcollections werden von Firestore erzeugt und als nicht
  leere Dokument-IDs validiert.

### Scoring

Der Bereich `championship/scoring` enthält die Firebase-unabhängige
Berechnungslogik für:

- die Punkte eines Tipps
- die Ergebnisse aller Tipps eines Spiels einschließlich `lonelyHit`
- das Ranking eines Turniers einschließlich veröffentlichter Zusatzpunkte

Die Funktionen arbeiten auf den Domain-Modellen und können deshalb in den
Anwendungen sowie in Tests ohne Firestore verwendet werden.

### API-Verträge

Unter `contracts/api/championship` liegen die zusammengesetzten Antwortmodelle
des Unterbau-Servers. Sie verbinden die einzelnen Domain-Modelle für die von
der WWW-Anwendung verwendeten Endpunkte:

- aktuelle Tipps
- Spiele und deren Tipps
- Spieler und deren Tipps
- Turnierspiele
- Turnierspieler

Der Unterbau validiert aus Firestore geladene Dokumente und die daraus
erzeugten Antworten gegen diese Schemas. Damit teilen Server und Client
denselben Vertrag.

### Regelwerke

Der Bereich `rules` enthält das gespeicherte `RuleSet` und die unterstützten
Definitionen für Spiel-, Runden-, Tipp- und Zusatzfragenregeln. Ein Turnier
referenziert sein Regelwerk über `rulesId`.

## Öffentliche Schnittstelle

Alle unterstützten Exporte werden über `src/index.ts` bereitgestellt:

```ts
import {
  ChampionshipSchema,
  calculateRanking,
  type Championship,
} from '@haus23/tipprunde-model';
```

Interne Hilfsschemas in `src/shared` sind bewusst kein Teil dieser
Schnittstelle.

## Entwicklung

TypeScript-Prüfung aus dem Repository-Root:

```sh
pnpm --filter=@haus23/tipprunde-model typecheck
```

Tests einmalig ausführen:

```sh
pnpm --filter=@haus23/tipprunde-model test --run
```

Mit Version 1.0.0 gilt die gemeinsame Modellierung der Legacy-Anwendungen als
abgeschlossen. Änderungen an der öffentlichen Schnittstelle werden weiterhin
über Changesets versioniert.
