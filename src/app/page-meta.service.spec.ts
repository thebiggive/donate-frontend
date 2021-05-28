import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageMetaService } from './page-meta.service';

describe('PageMetaService', () => {
  beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
        ],
      });
  }));

  it('should be created', () => {
    const service: PageMetaService = TestBed.inject(PageMetaService);
    expect(service).toBeTruthy();
  });
});
