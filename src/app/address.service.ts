/** This "service" is now just a collection of consts and types, as we don't have a lookup for now. */

/**
 * Used just to take raw input and put together an all-caps, spaced UK postcode, assuming the
 * input was valid (even if differently formatted). Loosely based on https://stackoverflow.com/a/10701634/2803757
 * with an additional tweak to allow (and trim) surrounding spaces.
 */
export const postcodeFormatHelpRegExp = new RegExp('^\\s*([A-Z]{1,2}\\d{1,2}[A-Z]?)\\s*(\\d[A-Z]{2})\\s*$');
// Based on the simplified pattern suggestions in https://stackoverflow.com/a/51885364/2803757
export const postcodeRegExp = new RegExp('^([A-Z][A-HJ-Y]?\\d[A-Z\\d]? \\d[A-Z]{2}|GIR 0A{2})$');

// Intentionally looser to support most countries' formats.
export const billingPostcodeRegExp = new RegExp('^[0-9a-zA-Z -]{2,8}$');

export type HomeAddress = { homeAddress: string; homePostcode: string };
