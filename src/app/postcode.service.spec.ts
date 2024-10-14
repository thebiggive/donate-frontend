import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PostcodeService } from './postcode.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PostcodeService', () => {
  let service: PostcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(PostcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
