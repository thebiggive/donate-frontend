import { TestBed } from '@angular/core/testing';

import { PageMetaService } from './page-meta.service';

describe('PageMetaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageMetaService = TestBed.inject(PageMetaService);
    expect(service).toBeTruthy();
  });
});
