import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map  } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { GiftAidAddress } from './gift-aid-address.model';
import { GiftAidAddressSuggestion } from './gift-aid-address-suggestion.model';
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {HomeAddress} from "./address-suggestions";

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
        console.log('PostcodeService.getSuggestions() error', error);
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
    this.get(event.option.value.url).subscribe((address: GiftAidAddress) => {
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
    }, error => {
      console.log('Postcode resolve error', error);
    });
  }

}
