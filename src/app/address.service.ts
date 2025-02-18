import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';

import {environment} from '../environments/environment';
import {GiftAidAddress} from './gift-aid-address.model';
import {GiftAidAddressSuggestion} from './gift-aid-address-suggestion.model';
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {AbstractControl} from "@angular/forms";

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

export type HomeAddress = { homeAddress: string, homeBuildingNumber: string, homePostcode: string };

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  getSuggestions(partialAddress: string): Observable<GiftAidAddressSuggestion[]> {
    // Get up to top 20 suggestions – the maximum allowed.
    const uri = `${environment.postcodeLookupUri}/autocomplete/${encodeURIComponent(partialAddress)}?top=20&api-key=${environment.postcodeLookupKey}`;

    return this.http.get<GiftAidAddressSuggestion[]>(uri).pipe(
      map((response: any) => response.suggestions),
      catchError((error) => {
        console.log('AddressService.getSuggestions() error', error);
        return EMPTY;
      }),
    );
  }

  get(addressUrl: string): Observable<GiftAidAddress> {
    return this.http.get<GiftAidAddress>(`${environment.postcodeLookupUri}${addressUrl}?api-key=${environment.postcodeLookupKey}`);
  }


  /**
   * Loads selected address from the postcode look up service and returns it to the callback
   *
   * @param event event's value.url should be an address we can /get.
   * @param callback Callback function to update the address when fetched
   */
  public loadAddress(event: MatAutocompleteSelectedEvent, callback: (address: HomeAddress) => void) {
    const autoCompleteSuggestionValue: GiftAidAddressSuggestion = event.option.value;
    this.get(autoCompleteSuggestionValue.url).subscribe({
    next: (address: GiftAidAddress) => {
      const addressParts = [address.line_1];
      if (address.line_2) {
        addressParts.push(address.line_2);
      }
      addressParts.push(address.town_or_city);

      const anAddress: HomeAddress = {
        homeAddress: addressParts.join(', '),
        homeBuildingNumber: address.building_number,
        homePostcode: address.postcode,
      } as const;

      callback(anAddress);
    },
    error: (error: unknown) => {
      // We failed to fetch an address from the lookup service so use the address from the suggestion as a fallback.
      // The donor will have to manually fill in their postcode. Home building number is not currently used.
      callback({
        homeAddress: autoCompleteSuggestionValue.address,
        homePostcode: '',
        homeBuildingNumber: '',
      });
      console.log('Postcode resolve error', error);
    }});
  }

  public suggestAddresses (
    {homeAddressFormControl, loadingAddressSuggestionCallback, foundAddressSuggestionCallback}: {
      homeAddressFormControl: AbstractControl,
      loadingAddressSuggestionCallback: () => void,
      foundAddressSuggestionCallback: (suggestions: GiftAidAddressSuggestion[]) => void
    }
  ) {
    const observable = homeAddressFormControl.valueChanges.pipe(
      startWith(''),
      // https://stackoverflow.com/a/51470735/2803757
      debounceTime(400),
      distinctUntilChanged(),
      // switchMap *seems* like the best operator to swap out the Observable on the value change
      // itself and swap in the observable on a lookup. But I'm not an expert with RxJS! I think/
      // hope this may also cancel previous outstanding lookup resolutions that are in flight?
      // https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap
      switchMap((initialAddress: string | false) => {
        if (!initialAddress) {
          return EMPTY;
        }

        loadingAddressSuggestionCallback();
        return this.getSuggestions(initialAddress);
      }),
    ) || EMPTY;

    observable.subscribe(foundAddressSuggestionCallback);
  }

  public static summariseAddressSuggestion(suggestion: GiftAidAddressSuggestion | string | undefined): string {
    // Patching a `giftAidGroup` seems to lead to a re-evaluation via this method, even if we use
    // `{emit: false}`. So it seems like the only safe way for the slightly hacky autocomplete return
    // approach of returning an object, then resolving from it, to work, is to explicitly check which
    // type this field has got before re-summarising it.
    if (typeof suggestion === 'string') {
      return suggestion;
    }

    return suggestion?.address || '';
  }

}
