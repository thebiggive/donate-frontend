import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentBannerComponent } from './cookie-consent-banner.component';

describe('CookieConsentBannerComponent', () => {
  let component: CookieConsentBannerComponent;
  let fixture: ComponentFixture<CookieConsentBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CookieConsentBannerComponent]
    });
    fixture = TestBed.createComponent(CookieConsentBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
