import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { InMemoryStorageService } from "ngx-webstorage-service";

import { TBG_DONATE_STORAGE } from "./donation.service";
import { StripeService } from "./stripe.service";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";

describe("StripeService", () => {
  let service: StripeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        InMemoryStorageService,
        // Inject in-memory storage for tests, in place of local storage.
        { provide: TBG_DONATE_STORAGE, useExisting: InMemoryStorageService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StripeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
