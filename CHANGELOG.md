# Changelog


## v0.4.0

[compare changes](https://github.com/haus23/tipprunde-backend/compare/v0.3.0...v0.4.0)


### 💅 Refactors

  - Aligned with changed model data. ([c123a7f](https://github.com/haus23/tipprunde-backend/commit/c123a7f))

### 🏡 Chore

  - Upgrade tipprunde types ([bbc9c46](https://github.com/haus23/tipprunde-backend/commit/bbc9c46))
  - Readding h3. autoimports not working else. ([b1df597](https://github.com/haus23/tipprunde-backend/commit/b1df597))

### ❤️  Contributors

- Micha Buchholz <micha@haus23.net>

## v0.3.0

[compare changes](https://github.com/haus23/tipprunde-backend/compare/v0.2.1...v0.3.0)


### 🩹 Fixes

  - Add cors headers again ([f47e704](https://github.com/haus23/tipprunde-backend/commit/f47e704))

### 💅 Refactors

  - Drop all caching by now ([ee19ef8](https://github.com/haus23/tipprunde-backend/commit/ee19ef8))
  - Change api version prefix to v1 ([e7a382b](https://github.com/haus23/tipprunde-backend/commit/e7a382b))
  - Validate h3 event. no need to import. ([c90d947](https://github.com/haus23/tipprunde-backend/commit/c90d947))
  - Use console to log ([520bc22](https://github.com/haus23/tipprunde-backend/commit/520bc22))
  - Drop unused explicit deps ([5d8b9f9](https://github.com/haus23/tipprunde-backend/commit/5d8b9f9))
  - Use type imports ([9876fc5](https://github.com/haus23/tipprunde-backend/commit/9876fc5))
  - Add route level caching again. mainly for dev purposes. see #2 ([#2](https://github.com/haus23/tipprunde-backend/issues/2))

### 🏡 Chore

  - Update deps incl nitro. recreate lockfile ([07c8f68](https://github.com/haus23/tipprunde-backend/commit/07c8f68))
  - Add readme with deployment hints ([9bc649a](https://github.com/haus23/tipprunde-backend/commit/9bc649a))

### ❤️  Contributors

- Micha Buchholz <micha@haus23.net>

## v0.2.1

[compare changes](https://github.com/haus23/tipprunde-backend/compare/v0.2.0...v0.2.1)


### 🚀 Enhancements

  - Add teams with current-matches route ([9580632](https://github.com/haus23/tipprunde-backend/commit/9580632))

## v0.2.0

[compare changes](https://github.com/haus23/tipprunde-backend/compare/v0.1.2...v0.2.0)


### 🚀 Enhancements

  - Implement querying current matches with tips. ([fbcabc3](https://github.com/haus23/tipprunde-backend/commit/fbcabc3))

### 💅 Refactors

  - Remove handler caching. the routes are cached as well. ([57cc833](https://github.com/haus23/tipprunde-backend/commit/57cc833))

### 🏡 Chore

  - Update trivial deps changes ([701fb54](https://github.com/haus23/tipprunde-backend/commit/701fb54))
  - Update tipprunde types ([7008b74](https://github.com/haus23/tipprunde-backend/commit/7008b74))
  - Update tipprunde types ([cbc9ff0](https://github.com/haus23/tipprunde-backend/commit/cbc9ff0))

## v0.1.2

[compare changes](https://github.com/haus23/tipprunde-backend/compare/v0.1.1...v0.1.2)


### 🚀 Enhancements

  - Add firebase query logging ([c0c87a5](https://github.com/haus23/tipprunde-backend/commit/c0c87a5))

### 🩹 Fixes

  - Cache players query as well ([140837c](https://github.com/haus23/tipprunde-backend/commit/140837c))

## v0.1.1

[compare changes](https://github.com/haus23/tipprunde-backend/compare/v0.1.0...v0.1.1)


### 🚀 Enhancements

  - Increase swr cache time to one hour ([3779154](https://github.com/haus23/tipprunde-backend/commit/3779154))

### 🩹 Fixes

  - Update env var name ([bb7c0f8](https://github.com/haus23/tipprunde-backend/commit/bb7c0f8))

### 💅 Refactors

  - Align config reading. ([e1cfe94](https://github.com/haus23/tipprunde-backend/commit/e1cfe94))
  - Switch to default cachedHandler and cachedFunction helpers ([11de80a](https://github.com/haus23/tipprunde-backend/commit/11de80a))

### 🏡 Chore

  - Update deps. ([c743923](https://github.com/haus23/tipprunde-backend/commit/c743923))

## v0.1.0

[compare changes](https://github.com/haus23/tipprunde-backend/compare/v0.0.0...v0.1.0)


### 🚀 Enhancements

  - Add static homepage. remove initial route. ([67e8e89](https://github.com/haus23/tipprunde-backend/commit/67e8e89))
  - Add first api route, v2 players route ([0f38836](https://github.com/haus23/tipprunde-backend/commit/0f38836))
  - Cache event handler ([dcf8bef](https://github.com/haus23/tipprunde-backend/commit/dcf8bef))
  - Add championships query and route ([f47928f](https://github.com/haus23/tipprunde-backend/commit/f47928f))
  - Create chained storage driver - registered via plugin. ([88ccca5](https://github.com/haus23/tipprunde-backend/commit/88ccca5))
  - Add utility to extract and validate championship from request ([bf1d22a](https://github.com/haus23/tipprunde-backend/commit/bf1d22a))
  - Championship ranking route ([8d98d1a](https://github.com/haus23/tipprunde-backend/commit/8d98d1a))
  - Add cors headers for api queries ([e392278](https://github.com/haus23/tipprunde-backend/commit/e392278))

### 🩹 Fixes

  - Need to install h3 to make auto imports work. ([a127e7c](https://github.com/haus23/tipprunde-backend/commit/a127e7c))
  - Add default values ([f571508](https://github.com/haus23/tipprunde-backend/commit/f571508))
  - Proper typing for query fn args ([645b210](https://github.com/haus23/tipprunde-backend/commit/645b210))
  - Parse instead of non-null assertion ([3ec1c46](https://github.com/haus23/tipprunde-backend/commit/3ec1c46))

### 💅 Refactors

  - Configure caching. ([5169fe9](https://github.com/haus23/tipprunde-backend/commit/5169fe9))
  - Create cache helper with sane defaults ([c3aedf3](https://github.com/haus23/tipprunde-backend/commit/c3aedf3))
  - Create business logic query helper ([0aa68b6](https://github.com/haus23/tipprunde-backend/commit/0aa68b6))
  - Limit http method to get ([59fc574](https://github.com/haus23/tipprunde-backend/commit/59fc574))

### 🏡 Chore

  - Add changelog generator. ([a627cc3](https://github.com/haus23/tipprunde-backend/commit/a627cc3))
  - Configure server address and port ([6bc4d9e](https://github.com/haus23/tipprunde-backend/commit/6bc4d9e))
  - Configure formatting. ([a80a34c](https://github.com/haus23/tipprunde-backend/commit/a80a34c))
  - Install and prepare firebase sdk usage. ([42c2301](https://github.com/haus23/tipprunde-backend/commit/42c2301))
  - Add tipprunde types. need to overhaul ts config. ([0c7c2b5](https://github.com/haus23/tipprunde-backend/commit/0c7c2b5))
  - Update deps ([fd762ea](https://github.com/haus23/tipprunde-backend/commit/fd762ea))
  - Update tsconfig. ([cfe640e](https://github.com/haus23/tipprunde-backend/commit/cfe640e))

