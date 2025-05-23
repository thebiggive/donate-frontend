import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InMemoryStorageService } from 'ngx-webstorage-service';
import { of } from 'rxjs';

import { TBG_DONATE_STORAGE } from '../donation.service';
import { IdentityService } from '../identity.service';
import { MyAccountComponent } from './my-account.component';
import { ActivatedRoute } from '@angular/router';
import { MatomoModule } from 'ngx-matomo-client';

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyAccountComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatomoModule.forRoot({
          siteId: '',
          trackerUrl: '',
        }),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {} }, // Needed for ngx-matomo not to crash.
        InMemoryStorageService,
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        provideHttpClient(withFetch()),
      ],
    });
  });

  beforeEach(() => {
    const mockIdentityService = TestBed.inject(IdentityService);
    spyOn(mockIdentityService, 'getLoggedInPerson').and.returnValue(
      of({
        first_name: 'Generous',
        last_name: 'Donor',
        email_address: 'donor@example.com',
      }),
    );

    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;

    element = fixture.nativeElement.querySelector('main');

    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should show donor name and email', () => {
    expect(element.textContent).toContain('Generous Donor');
    expect(element.textContent).toContain('donor@example.com');
  });
});
