import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Donation } from './donation.model';
import { DonationCreatedResponse } from './donation-created-response.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private apiPath = '/donations/services/apexrest/v1.0/donations';

  constructor(
    private http: HttpClient,
  ) {}

  create(donation: Donation): Observable<DonationCreatedResponse> {
    return this.http.post<DonationCreatedResponse>(`${environment.apiUriPrefix}${this.apiPath}`, donation);
  }

  saveToken(donationId, jwt) {
    // TODO
    console.log('Token for later donation usage is TODO! Would have saved JWT for ID ', donationId);
  }
}
