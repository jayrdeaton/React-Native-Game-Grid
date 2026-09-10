# @tastic/grid

Pure coordinate math and BFS reachability for tile/board-based games: bounds checks, cell/pixel conversion, adjacency, and flood-fill reachability queries. No React or React Native dependency in `src/` itself.

Part of the [`@tastic`](https://www.npmjs.com/org/tastic) package ecosystem (the game-focused corner of the `@rific`/InfiniteToken fleet). Re-exports `Direction`/`flipDirection`/`isOppositeDirection` from [`@tastic/input`](https://github.com/jayrdeaton/react-native-game-input) rather than redefining them, so every fleet game shares one direction vocabulary.

## Install

```bash
npm install @tastic/grid @tastic/input
```

## Usage

```ts
import { cellKey, computeGridSize, distanceToNearestTarget, isInBounds, stepCell } from '@tastic/grid'

const grid = computeGridSize(320, 320, 32) // { cols: 10, rows: 10 }

const occupied = new Set(['3,3', '3,4', '3,5'])
const next = stepCell({ x: 2, y: 4 }, 'right')
if (isInBounds(next, grid) && !occupied.has(cellKey(next))) {
  // move is legal
}

// Is an enemy at (0, 0) able to reach the player at (5, 5) at all, given the current walls/blocks?
const reachable = distanceToNearestTarget({ x: 0, y: 0 }, grid, occupied, new Set([cellKey({ x: 5, y: 5 })]))
const isTrapped = reachable === null
```

## API

- `GridCell`, `GridSize` — plain coordinate/dimension shapes
- `ALL_DIRECTIONS` — the 4 cardinal directions, fixed order
- `computeGridSize(width, height, cellPx)` — how many whole cells fit a pixel area
- `cellToPixel(cell, cellPx)` / `pixelToCell(point, cellPx)` — inverse conversions between grid and pixel space
- `cellKey(cell)` — stable string key for `Set`/`Map` occupancy tracking
- `isInBounds(cell, grid)` — bounds check
- `wrapCell(cell, grid)` — re-enters an off-grid cell from the opposite edge, for wrap-around/torus topology
- `stepCell(cell, direction)` — one step in a cardinal direction
- `isAdjacent(a, b)` — true when two cells are exactly one step apart
- `countReachableCells(start, grid, occupied, maxCount?)` — BFS: how many cells are reachable from `start` without crossing `occupied` cells or the grid edge
- `distanceToNearestTarget(start, grid, occupied, targets, maxCount?)` — BFS: shortest step-distance from `start` to any cell in `targets`, or `null` if none is reachable — the shape a "can this entity still reach that cell" / trapped check needs
- `Direction`, `flipDirection`, `isOppositeDirection` — re-exported from `@tastic/input`

## License

MIT
