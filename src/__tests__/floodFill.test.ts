import { cellKey } from '../coordinates'
import { countReachableCells, distanceToNearestTarget } from '../floodFill'

const grid = { cols: 5, rows: 5 }

describe('countReachableCells', () => {
  it('counts every open cell on a fully empty grid', () => {
    expect(countReachableCells({ x: 0, y: 0 }, grid, new Set())).toBe(25)
  })

  it('returns 0 when the start cell itself is occupied', () => {
    const occupied = new Set([cellKey({ x: 0, y: 0 })])
    expect(countReachableCells({ x: 0, y: 0 }, grid, occupied)).toBe(0)
  })

  it('returns 0 when the start cell is out of bounds', () => {
    expect(countReachableCells({ x: -1, y: 0 }, grid, new Set())).toBe(0)
  })

  it('stops at a wall of occupied cells sealing off a pocket', () => {
    // Wall off column x=1 entirely, leaving column x=0 (5 cells) isolated from the rest.
    const occupied = new Set([0, 1, 2, 3, 4].map((y) => cellKey({ x: 1, y })))
    expect(countReachableCells({ x: 0, y: 0 }, grid, occupied)).toBe(5)
  })

  it('respects maxCount as an early-exit bound', () => {
    expect(countReachableCells({ x: 0, y: 0 }, grid, new Set(), 3)).toBe(3)
  })
})

describe('distanceToNearestTarget', () => {
  it('returns 0 when the start cell is itself a target', () => {
    const targets = new Set([cellKey({ x: 2, y: 2 })])
    expect(distanceToNearestTarget({ x: 2, y: 2 }, grid, new Set(), targets)).toBe(0)
  })

  it('returns the shortest step-distance to any target cell', () => {
    const targets = new Set([cellKey({ x: 3, y: 0 })])
    expect(distanceToNearestTarget({ x: 0, y: 0 }, grid, new Set(), targets)).toBe(3)
  })

  it('returns null when no target is reachable', () => {
    // Wall off column x=1 entirely, sealing x=0 away from the target at x=3 — this is the exact
    // shape of a trapped-enemy check: an entity's pocket cut off from the target it needs to reach.
    const occupied = new Set([0, 1, 2, 3, 4].map((y) => cellKey({ x: 1, y })))
    const targets = new Set([cellKey({ x: 3, y: 0 })])
    expect(distanceToNearestTarget({ x: 0, y: 0 }, grid, occupied, targets)).toBeNull()
  })

  it('returns null when the start cell itself is occupied', () => {
    const occupied = new Set([cellKey({ x: 0, y: 0 })])
    const targets = new Set([cellKey({ x: 1, y: 0 })])
    expect(distanceToNearestTarget({ x: 0, y: 0 }, grid, occupied, targets)).toBeNull()
  })
})
