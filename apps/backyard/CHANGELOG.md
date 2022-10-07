# backyard

## 0.0.29

### Patch Changes

- [#24](https://github.com/haus23/runde.tips/pull/24) [`56b4758`](https://github.com/haus23/runde.tips/commit/56b4758cbefe7f854530bcb8dfc4a60aeb628dec) Thanks [@lean-dev](https://github.com/lean-dev)! - Fix test due to move of the hook.

- [#24](https://github.com/haus23/runde.tips/pull/24) [`be9627b`](https://github.com/haus23/runde.tips/commit/be9627bd33cd6fb9fdc600108c139925cd4fd8ac) Thanks [@lean-dev](https://github.com/lean-dev)! - Add feature: adding championship players.

- [#24](https://github.com/haus23/runde.tips/pull/24) [`6549db7`](https://github.com/haus23/runde.tips/commit/6549db7fd5831d3236278ed147132ff4fc4434e7) Thanks [@lean-dev](https://github.com/lean-dev)! - Move current-championship to new current-data folder

- [#24](https://github.com/haus23/runde.tips/pull/24) [`22cc668`](https://github.com/haus23/runde.tips/commit/22cc668cfd215d9af5c9be89ec2b6da314135e48) Thanks [@lean-dev](https://github.com/lean-dev)! - Navigate to championship view after creating one.

- Updated dependencies [[`066d732`](https://github.com/haus23/runde.tips/commit/066d732167d04371e4d400d5aa97a545a9636ac7), [`d608978`](https://github.com/haus23/runde.tips/commit/d60897850b9d9b6d50a1464c7f9e37ef1b049536), [`d87564c`](https://github.com/haus23/runde.tips/commit/d87564c80ec92cf60f66764514a97481c763ffc8)]:
  - ui@0.0.10
  - lib@0.0.14

## 0.0.28

### Patch Changes

- 9900ce0: Simplify nav. No need for extra championship players view.
- c47aeba: Implement workflow publishing a championship
- Updated dependencies [ade137d]
- Updated dependencies [d4b112a]
  - ui@0.0.9

## 0.0.27

### Patch Changes

- e9f8f9b: Temporary fix for unused var.
- 9e8f339: Fix path typings.
- d004430: Remove any type. Simplify code in usages.
- 0966dea: Delete unused components.
- c26e1e1: Eliminate non-null assertions.
- 59a985c: Eliminate banned empty object. And fix wrong usage in custom button.
- fc4f41c: Add missing hook dep.
- Updated dependencies [dbd386c]
  - lib@0.0.13

## 0.0.26

### Patch Changes

- f280d44: Add linting.

## 0.0.25

### Patch Changes

- Create first workflow: create first championship.

## 0.0.24

### Patch Changes

- Rename domain to master-data.
- Move firestore related code to lib.
- Singularize state in folder name.
- Move remaining models to lib package.
- Updated dependencies
- Updated dependencies
  - lib@0.0.12

## 0.0.23

### Patch Changes

- Update deps.
- Updated dependencies
  - ui@0.0.8

## 0.0.22

### Patch Changes

- Mark dashboard link exact. Resolves #6
- Refactor master-data routes. Add championships, drop users.
- Add state for current championship
- Refactor current data routes.

## 0.0.21

### Patch Changes

- Final auth solution ;-)
- Add very early auth gate in app and manage auth state there as well.
- Drop jotai again and stay with recoil.
- Simplify user profile.
- Updated dependencies
  - lib@0.0.11

## 0.0.20

### Patch Changes

- Navigate to login after logout.

## 0.0.19

### Patch Changes

- Rename to app-shell and simplify. Handle auth via loader function.
- Import shareable tailwind config.
- Refactor authentication and user profile.
- Rename layout to app-shell
- Create new auth-hook free login page. Changed routing as well.
- Updated dependencies
- Updated dependencies
  - lib@0.0.10

## 0.0.18

### Patch Changes

- Make notify function awaitable.
- Move championship model to lib.

## 0.0.17

### Patch Changes

- Fix for issue #8: crash if no user profile for firebase user.

## 0.0.16

### Patch Changes

- Change wording: ruleset -> rules
- Updated dependencies
  - lib@0.0.9

## 0.0.15

### Patch Changes

- Refactor rules to lib package usage.

## 0.0.14

### Patch Changes

- Add lib package dependency.
- Updated dependencies
  - lib@0.0.8

## 0.0.13

### Patch Changes

- Remove test setup.
- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
- Updated dependencies
  - lib@0.0.7

## 0.0.12

### Patch Changes

- Simplify select-field with default prop values.
- Updated dependencies
  - ui@0.0.7

## 0.0.11

### Patch Changes

- Updated dependencies
  - ui@0.0.6

## 0.0.10

### Patch Changes

- Updated dependencies
  - ui@0.0.5

## 0.0.9

### Patch Changes

- Create a new streamlined multi-purpose select-field
- Updated dependencies
  - ui@0.0.4

## 0.0.8

### Patch Changes

- Updated dependencies
  - ui@0.0.3

## 0.0.7

### Patch Changes

- Simplify rule names.
  - ui@0.0.2

## 0.0.6

### Patch Changes

- Updated dependencies
  - ui@0.0.2

## 0.0.5

### Patch Changes

- Updated dependencies
  - ui@0.0.1

## 0.0.4

### Patch Changes

- Adjust tailwind config to parse ui lib as well.

## 0.0.3

### Patch Changes

- Drop backyard splashscreen.
- Add ui package to backyard.
- Use the ui lib splashscreen.

## 0.0.2

### Patch Changes

- Fix module extensions.

## 0.0.1

### Patch Changes

- Initial monorepo release
