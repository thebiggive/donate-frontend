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
      video: [
        {
          provider: "youtube",
          key: "1G_Abc2delF",
        }
      ],
      updates: [],
      title: 'Some title',
      target: 2000.01,
      summary: 'Some long summary',
      quotes: [
        {
          quote: "Some quote",
          person: "Someones quote",
        },
      ],
      startDate: '2019-07-03T15:30:00.000Z',
      isMatched: true,
      id: 'a051r00001EywjpAAB',
      giftHandles: [
        {
          description: "Can buy you 2 things",
          amount: 50.01,
        },
      ],
      charity: [
        {
          name: 'Awesome Charity',
          id: '0011r00002HHAprAAH',
        },
      ],
      endDate: '2019-07-10T13:30:00.000Z',
      championName: 'The Big Give Match Fund',
      budgetDetails: [
        {
          description: 'x',
          amount: 2000.01,
        },
      ],
      /* tslint:disable:max-line-length*/
      bannerUri: 'https://thebiggive--Full--c.cs101.content.force.com/sfc/dist/version/download/?oid=00D1X0000008ahG&ids=0681X0000007w5l&d=%2Fa%2F1X0000008UpU%2FvdeP6lXwciVq6CMSA8BhwNQ6hNTyZHu7VmcugZgN2SY&asPdf=false',
      /* tslint:enable:max-line-length*/
      amountRaised: 200.00,
      additionalImageUris: [
        {
          /* tslint:disable:max-line-length*/
          uri: "https://thebiggive--c.eu12.content.force.com/sfc/dist/version/download/?oid=00D0O000000YzQm&ids=0681r00000CtcvY&d=%2Fa%2F1r0000002Ypn%2FeDMuuQUiOagDxe4259w1_.zlHnaPgj2nMiGJ5M.Gi2Y&asPdf=false",
          /* tslint:enable:max-line-length*/
          order: 100,
        },
      ],
    }];

    service.getCampaign('a051r00001EywjpAAB').subscribe(campaign => {
      expect(campaign.length).toBe(1);
      expect(campaign).toEqual(dummyCampaign);
    });

    const request = httpMock.expectOne(`${environment.apiUriPrefix}/campaigns/services/apexrest/v1.0/campaigns/a051r00001EywjpAAB`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyCampaign);

  });

});
