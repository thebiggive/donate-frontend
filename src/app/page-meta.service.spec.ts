import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { PageMetaService } from './page-meta.service';

describe('PageMetaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
    });
  });

  it('should be created', () => {
    const service: PageMetaService = TestBed.inject(PageMetaService);
    expect(service).toBeTruthy();
  });
});
