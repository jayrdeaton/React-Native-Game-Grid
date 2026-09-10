import type { Direction } from '@tastic/input'

export interface GridCell {
  x: number
  y: number
}

export interface GridSize {
  cols: number
  rows: number
}

// The 4 directions a neighbor-walk considers, in a fixed order — the set floodFill.ts's BFS steps
// from every cell.
export const ALL_DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right']

export function computeGridSize(width: number, height: number, cellPx: number): GridSize {
  return {
    cols: Math.max(1, Math.floor(width / cellPx)),
    rows: Math.max(1, Math.floor(height / cellPx))
  }
}

export function cellToPixel(cell: GridCell, cellPx: number): { x: number; y: number } {
  return { x: cell.x * cellPx, y: cell.y * cellPx }
}

// Inverse of cellToPixel — floors a raw pixel point down to the cell it falls within, e.g. for
// translating a tap/touch coordinate on a rendered board back into grid coordinates.
export function pixelToCell(point: { x: number; y: number }, cellPx: number): GridCell {
  return { x: Math.floor(point.x / cellPx), y: Math.floor(point.y / cellPx) }
}

export function cellKey(cell: GridCell): string {
  return `${cell.x},${cell.y}`
}

export function isInBounds(cell: GridCell, grid: GridSize): boolean {
  return cell.x >= 0 && cell.y >= 0 && cell.x < grid.cols && cell.y < grid.rows
}

// Re-enters an off-grid cell from the opposite edge — the wrap-mode/torus-topology counterpart to
// isInBounds above: a caller implementing wrap-around edges typically checks isInBounds first and
// only wraps a cell that's already failed it. The double-mod handles a negative coordinate
// (stepping off the top/left) correctly, since JS's % can return a negative result that a single
// mod wouldn't clean up.
export function wrapCell(cell: GridCell, grid: GridSize): GridCell {
  return { x: ((cell.x % grid.cols) + grid.cols) % grid.cols, y: ((cell.y % grid.rows) + grid.rows) % grid.rows }
}

export function stepCell(cell: GridCell, direction: Direction): GridCell {
  switch (direction) {
    case 'up':
      return { x: cell.x, y: cell.y - 1 }
    case 'down':
      return { x: cell.x, y: cell.y + 1 }
    case 'left':
      return { x: cell.x - 1, y: cell.y }
    case 'right':
      return { x: cell.x + 1, y: cell.y }
  }
}

// True when `b` is exactly one step from `a` — the only distance stepCell itself can ever produce.
export function isAdjacent(a: GridCell, b: GridCell): boolean {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1
}
