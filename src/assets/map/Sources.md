# Map layer sources

Layers are all public ONS data. They're renamed for brevity in code.

The links and ONS labels for the current layers are:

- [UK nations](./nations.geojson) (outline always shown): [Countries (December 2025) Boundaries UK BUC](https://geoportal.statistics.gov.uk/datasets/818212ae5b2948bcb352842081c03762_0/explore?location=55.347727%2C-3.317025%2C5)
- [England regions](./englandRegions.geojson) (outline always shown): [Regions (December 2025) Boundaries EN BUC](https://geoportal.statistics.gov.uk/datasets/e66e8ccbf35344b3bd283fc68556eb15_0/explore?location=52.846103%2C-2.465416%2C6)
- [Counties](./counties.geojson): [Counties and Unitary Authorities (December 2025) Boundaries UK BUC](https://geoportal.statistics.gov.uk/datasets/e546277846294ad38138cbe651e7a3e0_0/explore?location=55.347727%2C-3.317025%2C5)
- [Local authorities](./localAuthorities.geojson): [Local Authority Districts (May 2025) Boundaries UK BUC](https://geoportal.statistics.gov.uk/datasets/729ef47ece1d486c883248d71bc3921f_0/explore?location=55.347727%2C-3.317025%2C5)

Note that unitary authorities appear in both `counties` and `localAuthorities` layers. This doesn't seem
worth explicitly deduplicating so far; it's OK for code that needs to highlight one as relevant to use whichever
feature it encounters first.

## Processing

Layer size was brought to a web-friendly level using [mapshaper](https://github.com/mbloch/mapshaper):

- `npx mapshaper src/assets/map/nations.geojson -simplify dp 5% -o src/assets/map/nations.geojson force`
- `npx mapshaper src/assets/map/englandRegions.geojson -simplify dp 5% -o src/assets/map/englandRegions.geojson force`
- `npx mapshaper src/assets/map/localAuthorities.geojson -simplify dp 15% -o src/assets/map/localAuthorities.geojson force`. 5% was 310KB but shapes appeared very different. 15% is 540KB and edge removal is noticeable but not terrible.
- `npx mapshaper src/assets/map/counties.geojson -simplify dp 15% -o src/assets/map/counties.geojson force` Assuming same principle as above based on similar size areas being included.
