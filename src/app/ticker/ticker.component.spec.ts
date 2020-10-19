import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Campaign } from '../campaign.model';
import { TickerComponent } from './ticker.component';
import { TimeLeftPipe } from '../time-left.pipe';

describe('TickerComponent', () => {
  let component: TickerComponent;
  let fixture: ComponentFixture<TickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TickerComponent, TimeLeftPipe ],
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
      [
        {
          description: 'budget line 1',
          amount: 2000.01,
        },
      ],
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
      {
        charityOptIn: 'Yes, I\'m happy to receive emails from',
        charityOptOut: 'No, I would not like to receive emails from',
        charityOptOutMessage: 'Please note that you might continue to receive communications from the charity if you have already shared your details with them via other methods.',
        tbgOptIn: 'Yes, I\'m happy to receive emails from',
        tbgOptOut: 'No, I would not like to receive emails from',
        tbgOptOutMessage: 'By selecting \'no\', we will no longer be able to email you about opportunities to double your donation.',
        championOptIn: 'Yes, I\'m happy to receive emails from',
        championOptOut: 'No, I would not like to receive emails from',
        championOptOutMessage: 'Please note that you might continue to receive communications from the champion if you have already shared your details with them via other methods.',
      },
      4,
      new Date(),
      [
        {
          description: 'Can buy you 2 things',
          amount: 50.01,
        },
      ],
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
