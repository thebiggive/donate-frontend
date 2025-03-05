/**
 * Taken from `country-code-lookup` version 0.0.20. Decoupled from the dependency to avoid
 * runtime processing and (primarily) to fix the performance impact of using a CommonJS
 * module. ("Warning: /usr/src/app/src/app/donation-start/donation-start.component.ts depends on
 * 'country-code-lookup'. CommonJS or AMD dependencies can cause optimization bailouts.)"
 *
 * One-time code used to sort and map the `countries`:
 *
 * let countryOptions = countries.sort((cA, cB)  => cA.country.localeCompare(cB.country))
 *   .map(country => {
 *     return {
 *       country: country.country,
 *       iso2: country.iso2,
 *     }
 *   });
 */
export const COUNTRIES = [
  {
    "country": "Afghanistan",
    "iso2": "AF"
  },
  {
    "country": "Åland Islands",
    "iso2": "AX"
  },
  {
    "country": "Albania",
    "iso2": "AL"
  },
  {
    "country": "Algeria",
    "iso2": "DZ"
  },
  {
    "country": "American Samoa",
    "iso2": "AS"
  },
  {
    "country": "Zimbabwe",
    "iso2": "ZW"
  }
] as const;

/**
 * Keys are ISO2 codes, values are names.
 */
export const countryOptions: { label: string; value: string }[] =
  COUNTRIES.map(country => ({label: country.country, value: country.iso2}));

export type countryISO2 = (typeof COUNTRIES)[number]["iso2"];
