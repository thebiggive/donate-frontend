import { Geometry, MultiPolygon, Polygon, Position } from 'geojson';

class Cell {
  readonly x: number;
  readonly y: number;
  readonly h: number;
  readonly d: number;
  readonly max: number;

  constructor(x: number, y: number, h: number, polygon: Position[][]) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.d = pointToPolygonDist(x, y, polygon);
    this.max = this.d + this.h * Math.SQRT2;
  }
}

/**
 * Finds the pole of inaccessibility (point inside polygon furthest from polygon boundary)
 * using Mapbox's Polylabel algorithm.
 *
 * @param polygon Array of rings [outerRing, ...holeRings] where each ring is an array of [lng, lat]
 * @param precision Precision in coordinate units (default 0.001)
 * @returns [lng, lat] of the pole of inaccessibility
 */
export function polylabel(polygon: Position[][], precision = 0.001): [number, number] {
  if (!polygon.length || !polygon[0].length) {
    return [0, 0];
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of polygon[0]) {
    if (p[0] < minX) minX = p[0];
    if (p[1] < minY) minY = p[1];
    if (p[0] > maxX) maxX = p[0];
    if (p[1] > maxY) maxY = p[1];
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const cellSize = Math.min(width, height);
  const h = cellSize / 2;

  if (cellSize === 0) {
    return [minX, minY];
  }

  const cellQueue: Cell[] = [];
  function pushCell(cell: Cell) {
    const idx = cellQueue.findIndex((c) => c.max < cell.max);
    if (idx === -1) {
      cellQueue.push(cell);
    } else {
      cellQueue.splice(idx, 0, cell);
    }
  }

  // Cover polygon with initial cells
  let bestCell = new Cell(minX + width / 2, minY + height / 2, 0, polygon);

  for (let x = minX; x < maxX; x += cellSize) {
    for (let y = minY; y < maxY; y += cellSize) {
      pushCell(new Cell(x + h, y + h, h, polygon));
    }
  }

  while (cellQueue.length > 0) {
    const cell = cellQueue.shift()!;

    if (cell.d > bestCell.d) {
      bestCell = cell;
    }

    if (cell.max - bestCell.d <= precision) {
      continue;
    }

    const nextH = cell.h / 2;
    pushCell(new Cell(cell.x - nextH, cell.y - nextH, nextH, polygon));
    pushCell(new Cell(cell.x + nextH, cell.y - nextH, nextH, polygon));
    pushCell(new Cell(cell.x - nextH, cell.y + nextH, nextH, polygon));
    pushCell(new Cell(cell.x + nextH, cell.y + nextH, nextH, polygon));
  }

  return [bestCell.x, bestCell.y];
}

/**
 * Signed distance from point to polygon boundary: positive inside, negative outside.
 */
export function pointToPolygonDist(x: number, y: number, polygon: Position[][]): number {
  let inside = false;
  let minDistSq = Infinity;

  for (const ring of polygon) {
    for (let i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
      const a = ring[i];
      const b = ring[j];

      if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) {
        inside = !inside;
      }

      minDistSq = Math.min(minDistSq, getSegDistSq(x, y, a, b));
    }
  }

  return (inside ? 1 : -1) * Math.sqrt(minDistSq);
}

function getSegDistSq(px: number, py: number, a: Position, b: Position): number {
  let x = a[0];
  let y = a[1];
  const dx = b[0] - x;
  const dy = b[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = b[0];
      y = b[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  const distX = px - x;
  const distY = py - y;

  return distX * distX + distY * distY;
}

/**
 * Computes the pole of inaccessibility for a GeoJSON Geometry (Polygon or MultiPolygon).
 * Returns { lat, lng } or null if not calculable.
 */
export function getPoleOfInaccessibility(
  geometry: Geometry | undefined,
  precision = 0.001,
): { lat: number; lng: number } | null {
  if (!geometry) {
    return null;
  }

  if (geometry.type === 'Polygon') {
    const [lng, lat] = polylabel((geometry as Polygon).coordinates, precision);
    return { lat, lng };
  }

  if (geometry.type === 'MultiPolygon') {
    const multi = geometry as MultiPolygon;
    let bestDist = -Infinity;
    let bestCoords: [number, number] | null = null;

    for (const polygon of multi.coordinates) {
      const pt = polylabel(polygon, precision);
      const dist = pointToPolygonDist(pt[0], pt[1], polygon);
      if (dist > bestDist) {
        bestDist = dist;
        bestCoords = pt;
      }
    }

    if (bestCoords) {
      return { lat: bestCoords[1], lng: bestCoords[0] };
    }
  }

  return null;
}
