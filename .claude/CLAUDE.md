# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

# @tastic/grid

Pure coordinate math and BFS reachability for tile/board-based games: bounds checks, cell/pixel
conversion, adjacency, and flood-fill reachability queries. No React or React Native dependency in
`src/` itself.

Part of the `@tastic` package ecosystem (the game-focused corner of the `@rific`/InfiniteToken
fleet). Extracted rather than duplicated a third time: Snake's `src/utils/grid.ts`/`floodFill.ts`
are themselves headed "ported verbatim from LightCycles' grid.ts/floodFill.ts" — this package is
where that copy-paste lineage stops. Re-exports `Direction`/`flipDirection`/`isOppositeDirection`
from [`@tastic/input`](https://github.com/jayrdeaton/react-native-game-input) rather than defining a
third copy of those too.

**Scope is deliberately narrow.** This package holds only coordinate math and reachability with zero
game semantics. It does NOT hold push/slide resolution, enemy AI, or any other game-specific board
logic — those stay app-local in whatever game needs them, at least until a second real consumer of
that exact logic exists (the same bar this package itself had to clear before being extracted).
Plain wrap-around coordinate math (`wrapCell`) is in scope as a generic torus-topology primitive —
but wrap-*aware* reachability (a flood-fill that redirects through a wrapped edge, combined with a
game's own portals/tunnels) stays app-local, same boundary as portals/tunnels below.

## Commands

```bash
npm run lint         # ESLint
npm run fix           # ESLint --fix
npm test              # Jest
npm run test:watch    # Jest --watchAll
npm run typecheck     # tsc --noEmit
npm run build         # tsup, outputs CJS + ESM + types to dist/
npm run build:watch   # tsup --watch
npm run verify        # lint + test + typecheck + build, in that order
```

Always run `npm run lint` before finishing any task.

## Release

```bash
npm run release:patch   # npm version patch && git push --follow-tags (or release:minor / release:major)
```

`preversion` runs `npm run verify` first. `prepublishOnly` runs `npm run build`. `publish.yml` fires on
`v*` tags and delegates to the shared reusable workflow
(`infinitetoken/Workflows/.github/workflows/npm-publish.yml@v1`) with `id-token: write` for OIDC
trusted publishing (no `NPM_TOKEN`) — published live at https://www.npmjs.com/package/@tastic/grid.

## Architecture

```
src/
  index.ts        - public exports barrel (re-exports Direction/flipDirection/isOppositeDirection
                     from @tastic/input alongside this package's own exports)
  coordinates.ts  - GridCell, GridSize, ALL_DIRECTIONS, computeGridSize, cellToPixel, pixelToCell,
                    cellKey, isInBounds, wrapCell, stepCell, isAdjacent
  floodFill.ts    - countReachableCells, distanceToNearestTarget (4-directional BFS)
  __tests__/
    coordinates.test.ts
    floodFill.test.ts
```

Two small pure-function files, no shared internal state, no game-specific parameters (no portals or
tunnels — those are Snake/LightCycles' own mechanics and stay in that app's local wrapper around this
package, not in the shared package itself). Plain wrap-around coordinate math (`wrapCell`) is the one
exception — see the scope note above.

## Public API

From `src/index.ts`:

- `GridCell`, `GridSize`, `ALL_DIRECTIONS`, `computeGridSize`, `cellToPixel`, `pixelToCell`,
  `cellKey`, `isInBounds`, `wrapCell`, `stepCell`, `isAdjacent` — `coordinates.ts`
- `countReachableCells`, `distanceToNearestTarget` — `floodFill.ts`
- `Direction`, `flipDirection`, `isOppositeDirection` — re-exported from `@tastic/input`, not
  redefined here

Single entry point — `exports["."]` in `package.json` has no subpaths (`react-native` condition →
`src/index.ts`, `types` → `dist/index.d.ts`, `import`/`require` → `dist/index.mjs`/`dist/index.js`).

## Peer Dependencies

- `@tastic/input` `>=0.2.0` — required, internal fleet package. Only `Direction`/`flipDirection`/
  `isOppositeDirection` are used (re-exported, not consumed internally by this package's own logic),
  so the floor tracks whatever version first published those three, not `@tastic/input`'s latest.

`react` is a devDependency (not a peer) purely to satisfy `@tastic/input`'s own built bundle the same
way `@tastic/input` itself keeps `react` as a devDependency for `@tastic/core` — see that package's
own CLAUDE.md for the underlying reason (an eager top-level `require('react')` baked into the tsup
output of the package chain this one sits on top of).

## Testing

- Framework: Jest (`@infinitetoken/jest-config/react-native`), jsdom test environment, no local
  mocks (`__mocks__/` doesn't exist — nothing here touches a native or DOM API)
- One suite per source file (`coordinates`, `floodFill`)
- `floodFill.test.ts` includes the exact shape a trapped-enemy check needs: a wall of occupied cells
  sealing a start cell's pocket away from a target cell, asserting `distanceToNearestTarget` returns
  `null` — this is the scenario the package was extracted to serve, not just incidental coverage

## Code Style

Enforced by ESLint + Prettier (`eslint.config.cjs` is a bare
`module.exports = require('@infinitetoken/eslint-config/react-native')` — no local overrides).
Follows the same Prettier/ESLint conventions as the rest of the `@tastic` package family (single
quotes, no semicolons, no trailing commas, `simple-import-sort`, `react-hooks/rules-of-hooks` as an
error) — see `@tastic/input`'s own CLAUDE.md for the full rule list, unchanged here.

## CI

`.github/workflows/ci.yml` uses the shared reusable workflow
(`infinitetoken/Workflows/.github/workflows/npm-ci.yml@v1`, defaults to `npm run verify`) — runs on
every PR and push to `main`, same as every other package in the fleet. See Release above for
`publish.yml`.
