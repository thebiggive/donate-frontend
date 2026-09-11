import { getPoleOfInaccessibility, pointToPolygonDist, polylabel } from './polylabel';
import { Geometry, MultiPolygon, Polygon } from 'geojson';

describe('polylabel', () => {
  it('should find center of a square polygon', () => {
    const square = [
      [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
        [0, 0],
      ],
    ];

    const [x, y] = polylabel(square, 0.1);
    expect(x).toBeCloseTo(5, 0);
    expect(y).toBeCloseTo(5, 0);
  });

  it('should find pole of inaccessibility inside concave C-shaped polygon away from bbox center', () => {
    // C-shaped polygon where bounding box center is at (5, 5) which is outside or in the empty cavity
    const cShape = [
      [
        [0, 0],
        [10, 0],
        [10, 3],
        [3, 3],
        [3, 7],
        [10, 7],
        [10, 10],
        [0, 10],
        [0, 0],
      ],
    ];

    const [x, y] = polylabel(cShape, 0.01);
    // Pole of inaccessibility must be inside the polygon (pointToPolygonDist > 0)
    const dist = pointToPolygonDist(x, y, cShape);
    expect(dist).toBeGreaterThan(0);
    // And x should be in the thick spine of the C (x <= 3)
    expect(x).toBeLessThan(4);
  });

  it('should handle empty polygon safely', () => {
    expect(polylabel([])).toEqual([0, 0]);
    expect(polylabel([[]])).toEqual([0, 0]);
  });
});

describe('getPoleOfInaccessibility', () => {
  it('should return null for undefined or unsupported geometry', () => {
    expect(getPoleOfInaccessibility(undefined)).toBeNull();
    expect(getPoleOfInaccessibility({ type: 'Point', coordinates: [0, 0] } as Geometry)).toBeNull();
  });

  it('should calculate pole for a Polygon geometry', () => {
    const geom: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [-2.0, 52.0],
          [-1.0, 52.0],
          [-1.0, 53.0],
          [-2.0, 53.0],
          [-2.0, 52.0],
        ],
      ],
    };

    const pole = getPoleOfInaccessibility(geom);
    expect(pole).toBeTruthy();
    expect(pole?.lng).toBeCloseTo(-1.5, 1);
    expect(pole?.lat).toBeCloseTo(52.5, 1);
  });

  it('should pick largest sub-polygon in a MultiPolygon', () => {
    const geom: MultiPolygon = {
      type: 'MultiPolygon',
      coordinates: [
        // Tiny island
        [
          [
            [0, 0],
            [0.1, 0],
            [0.1, 0.1],
            [0, 0.1],
            [0, 0],
          ],
        ],
        // Big mainland
        [
          [
            [10, 10],
            [20, 10],
            [20, 20],
            [10, 20],
            [10, 10],
          ],
        ],
      ],
    };

    const pole = getPoleOfInaccessibility(geom);
    expect(pole).toBeTruthy();
    expect(pole?.lng).toBeCloseTo(15, 0);
    expect(pole?.lat).toBeCloseTo(15, 0);
  });
});
