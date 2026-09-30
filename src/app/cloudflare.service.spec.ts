import { TestBed } from '@angular/core/testing';
import { CloudflareService } from './cloudflare.service';

describe('CloudflareService', () => {
  let service: CloudflareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudflareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
