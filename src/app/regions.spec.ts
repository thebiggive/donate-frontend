import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { getHighlightedFeatures } from './regions';

describe('getHighlightedFeatures', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch layers and map name and code properties to matched features', async () => {
    const regionCodes = ['E12000007'];

    const promise = getHighlightedFeatures(regionCodes, httpClient);

    const reqLA = httpTestingController.expectOne('../../assets/map/localAuthorities.geojson');
    reqLA.flush({ type: 'FeatureCollection', features: [] });

    const reqCounties = httpTestingController.expectOne('../../assets/map/counties.geojson');
    reqCounties.flush({ type: 'FeatureCollection', features: [] });

    const reqEng = httpTestingController.expectOne('../../assets/map/englandRegions.geojson');
    reqEng.flush({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            RGN25CD: 'E12000007',
            RGN25NM: 'London',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [],
          },
        },
        {
          type: 'Feature',
          properties: {
            RGN25CD: 'E12000008',
            RGN25NM: 'South East',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [],
          },
        },
      ],
    });

    const reqNations = httpTestingController.expectOne('../../assets/map/nations.geojson');
    reqNations.flush({ type: 'FeatureCollection', features: [] });

    const results = await promise;

    expect(results.length).toBe(1);
    expect(results[0].properties?.['name']).toBe('London');
    expect(results[0].properties?.['code']).toBe('E12000007');
  });
});
