# Projekt: @haus23/tipprunde-hinterhof

> Haus23 Tipprunde Legacy Admin Website

## Release Stopper

- Linting, CSS Sorting, ...
- Eliminate old path alias: "@/*"

## Modernize App

- Upgrade to headlessui v2
- Eliminate usage of tailwind/headlessui package
- Eliminate usage of tailwind/forms plugin
  - Usages:
    - www/src/app/current-data/matches
    - ui-legacy: 
      - form/text-field
      - form/date-field
      - elements/select
