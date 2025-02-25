# Projekt: tipprunde-legacy

> Monorepo mit den Legacy-Projekten der Haus23 Tipprunde.

## TODO

- Remove cloudflare key: COREPACK_INTEGRITY_KEYS=0
- Approve pnpm build scripts on branch v1: `pnpm approve-builds`
- Generate certs vie lego for the now cloudflare hosted domain
- Check false routes:
  - http://localhost:5173/rr2426/ergebnisse  (Wrong championship)

## Branches

- v1: Production Branch
- v1-staging: Staging Branch
- main: Development Branch

## Workflow:

Geplante Änderungen an v1 werden in v1-staging gemacht. Nach Erfolg
als fast-forward merge in die Branches v1 und main eingebracht

Siehe: https://git-scm.com/book/en/v2/Git-Branching-Rebasing

Hinweise für den Staging/Production Workflow:
- Commits in v1-staging
- Push and Validate
- Checkout v1 and git merge v1-staging --ff-only
- Push and Deploy

## Tools

npx syncpack --help
npx depcheck --help
