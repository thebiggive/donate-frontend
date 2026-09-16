import { firstValueFrom } from 'rxjs';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export function addEnglandToNameWhereNeeded(basename: string) {
  // These specific region names are parts of England, but the name doesn't make that clear. If we used the name as
  // it comes then it could be understood as divisions of the UK instead.
  if (['North East', 'North West', 'South East', 'South West'].includes(basename)) {
    return basename + ' England';
  }

  return basename;
}

/**
 * Transforms a list of regionCodes into an array of geoJson features.
 *
 * Consider looking to import the geoJson files instead of fetching via HTTP, and/or moving this processing to matchbot.
 * @param regionCodes
 * @param http
 */
export async function getHighlightedFeatures(
  regionCodes: string[],
  http: HttpClient,
): Promise<Array<Feature<Geometry, GeoJsonProperties>>> {
  const layers = [
    {
      path: new URL('/assets/map/localAuthorities.geojson', environment.donateUriPrefix),
      codeField: 'LAD25CD',
      nameField: 'LAD25NM',
    },
    {
      path: new URL('/assets/map/counties.geojson', environment.donateUriPrefix),
      codeField: 'CTYUA25CD',
      nameField: 'CTYUA25NM',
    },
    {
      path: new URL('/assets/map/englandRegions.geojson', environment.donateUriPrefix),
      codeField: 'RGN25CD',
      nameField: 'RGN25NM',
    },
    {
      path: new URL('/assets/map/nations.geojson', environment.donateUriPrefix),
      codeField: 'CTRY25CD',
      nameField: 'CTRY25NM',
    },
  ];

  const fetchPromises = layers.map(async (layer) => {
    const data = await firstValueFrom(http.get<FeatureCollection>(layer.path.toString()));

    return data.features
      .filter(
        (feature: Feature<Geometry, GeoJsonProperties>) =>
          feature.properties && regionCodes.includes(feature.properties[layer.codeField]),
      )
      .map((feature: Feature<Geometry, GeoJsonProperties>) => {
        if (feature.properties) {
          feature.properties['name'] = addEnglandToNameWhereNeeded(feature.properties[layer.nameField]);
          feature.properties['code'] = feature.properties[layer.codeField];
        }
        return feature;
      });
  });

  const results = await Promise.all(fetchPromises);
  return results.flat();
}
