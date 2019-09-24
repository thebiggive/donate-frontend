import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

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

    const dummyCampaign: Campaign = {
      additionalImageUris: [
        {
          // tslint:disable-next-line
          uri: 'https://thebiggive--c.eu12.content.force.com/sfc/dist/version/download/?oid=00D0O000000YzQm&ids=0681r00000CtcvY&d=%2Fa%2F1r0000002Ypn%2FeDMuuQUiOagDxe4259w1_.zlHnaPgj2nMiGJ5M.Gi2Y&asPdf=false',
          order: 100,
        },
      ],
      alternativeFundUse: 'Some information about what happens if funds are not used',
      amountRaised: 200.00,
      // tslint:disable-next-line
      bannerUri: 'https://thebiggive--Full--c.cs107.content.force.com/sfc/dist/version/download/?oid=00D1X0000008ahG&ids=0681X0000007w5l&d=%2Fa%2F1X0000008UpU%2FvdeP6lXwciVq6CMSA8BhwNQ6hNTyZHu7VmcugZgN2SY&asPdf=false',
      budgetDetails: [
        {
          description: 'x',
          amount: 2000.01,
        },
      ],
      championName: 'The Big Give Match Fund',
      charity: {
        name: 'Awesome Charity',
        id: '0011r00002HHAprAAH',
      },
      donationCount: 4,
      endDate: new Date(),
      giftHandles: [
        {
          description: 'Can buy you 2 things',
          amount: 50.01,
        },
      ],
      id: 'a051r00001EywjpAAB',
      isMatched: true,
      matchFundsRemaining: 987.00,
      quotes: [
        {
          quote: 'Some quote',
          person: 'Someones quote',
        },
      ],
      startDate: new Date(),
      status: 'Active',
      summary: 'Some long summary',
      target: 2000.01,
      title: 'Some title',
      updates: [],
      video: [
        {
          provider: 'youtube',
          key: '1G_Abc2delF',
        },
      ],
    };

    service.getOneById('a051r00001EywjpAAB').subscribe(campaign => {
      expect(campaign).toEqual(dummyCampaign);
    }, () => {
      expect(false).toBe(true); // Always fail if observable errors
    });

    const request = httpMock.expectOne(`${environment.apiUriPrefix}/campaigns/services/apexrest/v1.0/campaigns/a051r00001EywjpAAB`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyCampaign);
  });
});
