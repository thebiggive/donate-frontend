import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PostcodeService } from './postcode.service';

describe('PostcodeService', () => {
  let service: PostcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(PostcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
