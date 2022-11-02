import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Campaign } from '../campaign.model';
import { TickerComponent } from './ticker.component';

describe('TickerComponent', () => {
  let component: TickerComponent;
  let fixture: ComponentFixture<TickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickerComponent);
    component = fixture.componentInstance;
    // TODO make Campaign an interface and simplify unit test data.
    component.campaign = new Campaign(
      'a051r00001EywjpAAB',
      ['Aim 1'],
      200.00,
      [
        {
          uri: 'https://example.com/some-additional-image.png',
          order: 100,
        },
      ],
      'https://example.com/some-banner.png',
      ['Other'],
      [
        {
          description: 'budget line 1',
          amount: 2000.01,
        },
      ],
      ['Animals'],
      'The Big Give Match Fund',
      {
        id: '0011r00002HHAprAAH',
        name: 'Awesome Charity',
        donateLinkId: 'SFIdOrLegacyId',
        optInStatement: 'Opt in statement.',
        website: 'https://www.awesomecharity.co.uk',
        regulatorNumber: '123456',
        regulatorRegion: 'Scotland',
      },
      ['United Kingdom'],
      'GBP',
      4,
      new Date(),
      'Impact reporting plan',
      'Impact overview',
      true,
      987.00,
      988.00,
      'The situation',
      [
        {
          quote: 'Some quote',
          person: 'Someones quote',
        },
      ],
      true,
      'The solution',
      new Date(),
      'Active',
      'Some long summary',
      2000.01,
      'Some title',
      [],
      'Some information about what happens if funds are not used',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        provider: 'youtube',
        key: '1G_Abc2delF',
      },
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
