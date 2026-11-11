import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withXhr } from '@angular/common/http';
import { environment } from '../environments/environment';
import { clearGeoJsonCache, getHighlightedFeatures } from './regions';

describe('getHighlightedFeatures', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    clearGeoJsonCache();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr()), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    clearGeoJsonCache();
  });

  it('should fetch layers and map name and code properties to matched features', async () => {
    const regionCodes = ['E12000007'];

    const promise = getHighlightedFeatures(regionCodes, httpClient);

    const reqLA = httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/localAuthorities.geojson`);
    reqLA.flush({ type: 'FeatureCollection', features: [] });
    await Promise.resolve();

    const reqCounties = httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/counties.geojson`);
    reqCounties.flush({ type: 'FeatureCollection', features: [] });
    await Promise.resolve();

    const reqEng = httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/englandRegions.geojson`);
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
    await Promise.resolve();

    const reqNations = httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/nations.geojson`);
    reqNations.flush({ type: 'FeatureCollection', features: [] });
    await Promise.resolve();

    const results = await promise;

    expect(results.length).toBe(1);
    expect(results[0].properties?.['name']).toBe('London');
    expect(results[0].properties?.['code']).toBe('E12000007');
  });

  it('should cache GeoJSON layers in memory and not repeat HTTP requests on subsequent calls', async () => {
    const promise1 = getHighlightedFeatures(['E12000007'], httpClient);

    httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/localAuthorities.geojson`).flush({
      type: 'FeatureCollection',
      features: [],
    });
    httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/counties.geojson`).flush({
      type: 'FeatureCollection',
      features: [],
    });
    httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/englandRegions.geojson`).flush({
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
    httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/nations.geojson`).flush({
      type: 'FeatureCollection',
      features: [],
    });

    const results1 = await promise1;
    expect(results1.length).toBe(1);
    expect(results1[0].properties?.['name']).toBe('London');

    // Second call should return cached data without emitting new HTTP requests
    const promise2 = getHighlightedFeatures(['E12000008'], httpClient);
    const results2 = await promise2;

    expect(results2.length).toBe(1);
    expect(results2[0].properties?.['name']).toBe('South East England');
    expect(results2[0].properties?.['code']).toBe('E12000008');

    // httpTestingController.verify() in afterEach will verify no pending or extra requests were made
  });

  it('should remove failed requests from cache to allow retrying', async () => {
    const promise1 = getHighlightedFeatures(['E12000007'], httpClient);

    const reqLA = httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/localAuthorities.geojson`);
    reqLA.error(new ProgressEvent('Network error'));
    httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/counties.geojson`).flush({
      type: 'FeatureCollection',
      features: [],
    });
    httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/englandRegions.geojson`).flush({
      type: 'FeatureCollection',
      features: [],
    });
    httpTestingController.expectOne(`${environment.donateUriPrefix}/assets/map/nations.geojson`).flush({
      type: 'FeatureCollection',
      features: [],
    });

    await expectAsync(promise1).toBeRejected();

    // Subsequent call should attempt to fetch localAuthorities.geojson again rather than reusing rejected promise
    const promise2 = getHighlightedFeatures(['E12000007'], httpClient);

    const reqLA2 = httpTestingController.expectOne(
      `${environment.donateUriPrefix}/assets/map/localAuthorities.geojson`,
    );
    reqLA2.flush({ type: 'FeatureCollection', features: [] });
    // Other 3 layers succeeded in the first call so they remain cached and won't be requested again

    const results2 = await promise2;
    expect(results2).toEqual([]);
  });
});
