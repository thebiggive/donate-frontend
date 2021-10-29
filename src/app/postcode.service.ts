import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map  } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { GiftAidAddress } from './gift-aid-address.model';
import { GiftAidAddressSuggestion } from './gift-aid-address-suggestion.model';

@Injectable({
  providedIn: 'root',
})
export class PostcodeService {
  constructor(private http: HttpClient) {}

  getSuggestions(partialAddress: string): Observable<GiftAidAddressSuggestion[]> {
    // Get up to top 20 suggestions – the maximum allowed.
    const uri = `${environment.postcodeLookupUri}/autocomplete/${encodeURIComponent(partialAddress)}?top=20&api-key=${environment.postcodeLookupKey}`;

    return this.http.get<GiftAidAddressSuggestion[]>(uri).pipe(
      map((response: any) => response.suggestions),
    );
  }

  get(addressUrl: string): Observable<GiftAidAddress> {
    return this.http.get<GiftAidAddress>(`${environment.postcodeLookupUri}${addressUrl}?api-key=${environment.postcodeLookupKey}`);
  }
}
