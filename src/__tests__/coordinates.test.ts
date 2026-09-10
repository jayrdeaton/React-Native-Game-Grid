import { ALL_DIRECTIONS, cellKey, cellToPixel, computeGridSize, isAdjacent, isInBounds, pixelToCell, stepCell, wrapCell } from '../coordinates'

describe('computeGridSize', () => {
  it('floors to whole cells that fit the given pixel dimensions', () => {
    expect(computeGridSize(100, 50, 20)).toEqual({ cols: 5, rows: 2 })
  })

  it('never returns less than 1 col/row even for a dimension smaller than one cell', () => {
    expect(computeGridSize(5, 5, 20)).toEqual({ cols: 1, rows: 1 })
  })
})

describe('cellToPixel / pixelToCell', () => {
  it('scales a cell coordinate up to pixels', () => {
    expect(cellToPixel({ x: 3, y: 2 }, 20)).toEqual({ x: 60, y: 40 })
  })

  it('is the inverse of cellToPixel for exact multiples', () => {
    expect(pixelToCell({ x: 60, y: 40 }, 20)).toEqual({ x: 3, y: 2 })
  })

  it('floors a pixel point down to the cell it falls within', () => {
    expect(pixelToCell({ x: 65, y: 45 }, 20)).toEqual({ x: 3, y: 2 })
  })
})

describe('cellKey', () => {
  it('produces a stable, distinct string per coordinate', () => {
    expect(cellKey({ x: 1, y: 2 })).toBe('1,2')
    expect(cellKey({ x: 2, y: 1 })).toBe('2,1')
  })
})

describe('isInBounds', () => {
  const grid = { cols: 5, rows: 5 }

  it('is true for a cell within the grid', () => {
    expect(isInBounds({ x: 0, y: 0 }, grid)).toBe(true)
    expect(isInBounds({ x: 4, y: 4 }, grid)).toBe(true)
  })

  it('is false for a negative or out-of-range coordinate', () => {
    expect(isInBounds({ x: -1, y: 0 }, grid)).toBe(false)
    expect(isInBounds({ x: 0, y: -1 }, grid)).toBe(false)
    expect(isInBounds({ x: 5, y: 0 }, grid)).toBe(false)
    expect(isInBounds({ x: 0, y: 5 }, grid)).toBe(false)
  })
})

describe('wrapCell', () => {
  const grid = { cols: 5, rows: 5 }

  it('leaves an in-bounds cell untouched', () => {
    expect(wrapCell({ x: 2, y: 3 }, grid)).toEqual({ x: 2, y: 3 })
  })

  it('wraps a coordinate past the far edge back to 0', () => {
    expect(wrapCell({ x: 5, y: 0 }, grid)).toEqual({ x: 0, y: 0 })
    expect(wrapCell({ x: 0, y: 5 }, grid)).toEqual({ x: 0, y: 0 })
  })

  it('wraps a negative coordinate back to the far edge', () => {
    expect(wrapCell({ x: -1, y: 0 }, grid)).toEqual({ x: 4, y: 0 })
    expect(wrapCell({ x: 0, y: -1 }, grid)).toEqual({ x: 0, y: 4 })
  })
})

describe('stepCell', () => {
  const origin = { x: 2, y: 2 }

  it('moves one cell in each of the 4 directions', () => {
    expect(stepCell(origin, 'up')).toEqual({ x: 2, y: 1 })
    expect(stepCell(origin, 'down')).toEqual({ x: 2, y: 3 })
    expect(stepCell(origin, 'left')).toEqual({ x: 1, y: 2 })
    expect(stepCell(origin, 'right')).toEqual({ x: 3, y: 2 })
  })
})

describe('isAdjacent', () => {
  it('is true for cells exactly one step apart', () => {
    expect(isAdjacent({ x: 2, y: 2 }, { x: 2, y: 1 })).toBe(true)
    expect(isAdjacent({ x: 2, y: 2 }, { x: 3, y: 2 })).toBe(true)
  })

  it('is false for the same cell or anything further than one step', () => {
    expect(isAdjacent({ x: 2, y: 2 }, { x: 2, y: 2 })).toBe(false)
    expect(isAdjacent({ x: 2, y: 2 }, { x: 3, y: 3 })).toBe(false)
    expect(isAdjacent({ x: 2, y: 2 }, { x: 4, y: 2 })).toBe(false)
  })
})

describe('ALL_DIRECTIONS', () => {
  it('lists all 4 cardinal directions exactly once', () => {
    expect(ALL_DIRECTIONS).toEqual(['up', 'down', 'left', 'right'])
  })
})
