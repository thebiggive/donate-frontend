import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatomoModule } from 'ngx-matomo';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { IdentityService, TBG_DONATE_ID_STORAGE } from './identity.service';
import { environment } from '../environments/environment';
import { Person } from './person.model';

describe('IdentityService', () => {
  const getDummyPerson = (): Person => {
    return {
      first_name: 'Michelle',
      last_name: 'Obama',
      email_address: 'm.o@example.org',
    };
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      MatomoModule.forRoot({
        scriptUrl: `https://example.com/matomo.js`,
        trackers: [],
        routeTracking: {
          enable: true,
        }
      }),
      RouterTestingModule,
    ],
    providers: [
      IdentityService,
      InMemoryStorageService,
      // Inject in-memory storage for tests, in place of local storage.
      { provide: TBG_DONATE_ID_STORAGE, useExisting: InMemoryStorageService },
    ],
  }));

  it('should be created', () => {
    const service: IdentityService = TestBed.inject(IdentityService);
    expect(service).toBeTruthy();
  });

  // Test service injection loosely based on https://alligator.io/angular/testing-httpclient/
  it(
    'should complete a create() with mocked service',
    inject(
      [HttpTestingController],
      (
        httpMock: HttpTestingController,
      ) => {
        const service: IdentityService = TestBed.inject(IdentityService);
        const person = getDummyPerson();

        service.create(person).subscribe(result => {
          expect(result.first_name).toEqual('Michelle');
        }, () => {
          expect(false).toBe(true); // Always fail if observable errors
        });

        const mockPost = httpMock.expectOne(`${environment.identityApiPrefix}/people`);
        expect(mockPost.request.method).toEqual('POST');
        expect(mockPost.cancelled).toBeFalsy();
        expect(mockPost.request.responseType).toEqual('json');
        const personCreatedResponse = { ... person }; // Copy object w/ spread operator.
        mockPost.flush(personCreatedResponse);

        httpMock.verify();
      },
    ),
  );
});
