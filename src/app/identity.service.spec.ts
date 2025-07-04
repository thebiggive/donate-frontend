import { provideHttpClient, withFetch } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MatomoModule } from 'ngx-matomo-client';
import { MatomoTestingModule } from 'ngx-matomo-client/testing';
import { InMemoryStorageService } from 'ngx-webstorage-service';

import { IdentityService } from './identity.service';
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

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        IdentityService,
        InMemoryStorageService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: MatomoModule, useClass: MatomoTestingModule },
      ],
    }),
  );

  it('should be created', () => {
    const service: IdentityService = TestBed.inject(IdentityService);
    expect(service).toBeTruthy();
  });

  // Test service injection loosely based on https://alligator.io/angular/testing-httpclient/
  it('should complete a create() with mocked service', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      const service: IdentityService = TestBed.inject(IdentityService);
      const person = getDummyPerson();

      service.create({ ...person, secretNumber: '123456' }).subscribe(
        (result) => {
          expect(result.first_name).toEqual('Michelle');
        },
        () => {
          expect(false).toBe(true); // Always fail if observable errors
        },
      );

      const mockPost = httpMock.expectOne(`${environment.identityApiPrefix}/people`);
      expect(mockPost.request.method).toEqual('POST');
      expect(mockPost.cancelled).toBeFalsy();
      expect(mockPost.request.responseType).toEqual('json');
      const personCreatedResponse = { ...person }; // Copy object w/ spread operator.
      mockPost.flush(personCreatedResponse);

      httpMock.verify();
    },
  ));
});
