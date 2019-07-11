import { TestBed } from '@angular/core/testing';

import { CharityCheckoutService } from './charity-checkout.service';

describe('CharityCheckoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharityCheckoutService = TestBed.get(CharityCheckoutService);
    expect(service).toBeTruthy();
  });
});
