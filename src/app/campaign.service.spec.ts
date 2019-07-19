import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { Campaign } from './campaign.model';
import { CampaignService } from './campaign.service';
import { environment } from '../environments/environment';

describe('CampaignService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ CampaignService ],
  }));

  it('should retrieve campaign details from API', () => {
    const service: CampaignService = TestBed.get(CampaignService);
    const httpMock: HttpTestingController = TestBed.get(HttpTestingController);

    const dummyCampaign: Campaign[] = [{
      video: [],
      updates: [],
      title: 'xx',
      target: 2000.00,
      summary: 'x',
      quotes: [],
      isMatched: true,
      id: 'a051X000000tMVZQA2',
      giftHandles: [],
      charity: [
        {
          name: 'Clapton Common Boys Club',
          id: '0011r00002HHAprAAH',
        },
      ],
      championName: null,
      budgetDetails: [
        {
          description: 'x',
          amount: 2000.00,
        },
      ],
      bannerUri: 'https://thebiggive--Full--c.cs101.content.force.com/sfc/dist/version/download/?oid=00D1X0000008ahG&ids=0681X0000007w5l&d=%2Fa%2F1X0000008UpU%2FvdeP6lXwciVq6CMSA8BhwNQ6hNTyZHu7VmcugZgN2SY&asPdf=false',
      amountRaised: 200.00,
      additionalImageUris: [],
    }];

    service.getCampaign('a051X000000tMVZQA2').subscribe(campaign => {
      expect(campaign.length).toBe(1);
      expect(campaign).toEqual(dummyCampaign);
    });

    const request = httpMock.expectOne(`${environment.apiUriPrefix}/campaigns/services/apexrest/v1.0/campaigns/a051X000000tMVZQA2`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyCampaign);

  });

});
