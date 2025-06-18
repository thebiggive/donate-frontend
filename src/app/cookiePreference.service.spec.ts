import { CookiePreferenceService } from './cookiePreference.service';
import { CookieService } from 'ngx-cookie-service';
import { TestBed } from '@angular/core/testing';

describe('CookiePreferenceService', () => {
  const mockCookieService: CookieService = {
    get: undefined,
    set: undefined,
  } as unknown as CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [mockCookieService],
    });
  });

  it('should show say user has not expressed cookie preference if no cookie preference cookie is set', (done) => {
    mockCookieService.get = (name) => {
      expect(name).toBe('cookie-preferences');
      return '';
    };

    const service = new CookiePreferenceService();

    service.userHasExpressedCookiePreference().subscribe({
      next: (value) => {
        expect(value).toBe(false);
        done();
      },
    });
  });

  it('should show user expressed cookie preference if all cookies accepted cookie is set', (done) => {
    mockCookieService.get = (name) => {
      expect(name).toBe('cookie-preferences');
      return '{"agreedToAll": true}';
    };

    const service = new CookiePreferenceService();

    service.userHasExpressedCookiePreference().subscribe({
      next: (value) => {
        expect(value).toBe(true);
        done();
      },
    });
  });

  it('should show user expressed cookie preference if marketing cookies are accepted', (done) => {
    mockCookieService.get = (name) => {
      expect(name).toBe('cookie-preferences');
      return '{"agreedToAll": false, "agreedToCookieTypes": {"marketing": true}}';
    };

    const service = new CookiePreferenceService();

    service.userHasExpressedCookiePreference().subscribe({
      next: (value) => {
        expect(value).toBe(true);
        done();
      },
    });
  });

  it('should show user expressed cookie preference if marketing cookies are rejected', (done) => {
    mockCookieService.get = (name) => {
      expect(name).toBe('cookie-preferences');
      return '{"agreedToAll": false, "agreedToCookieTypes": {"marketing": false}}';
    };

    const service = new CookiePreferenceService();

    service.userHasExpressedCookiePreference().subscribe({
      next: (value) => {
        expect(value).toBe(true);
        done();
      },
    });
  });

  it('Should set a cookie to show the user accepts all cookies', (done) => {
    // @ts-expect-error - we don't need to take all the params, only the ones our SUT will actually pass.
    mockCookieService.set = (name, value: string, duration: number, path: string, domain: string) => {
      expect(name).toBe('cookie-preferences');
      expect(JSON.parse(value).agreedToAll).toBe(true);
      expect(duration).toBe(365);
      expect(path).toBe('/');
      expect(domain).toBe('localhost');

      // not the most efficient way to assert that this function is called, if the SUT fails to call it we just get
      // a time out failure by not calling done within 5 seconds. There's nothing async here so we could fail straight
      // away if we don't call this. This may do for now.
      done();
    };

    const service = new CookiePreferenceService();

    service.agreeToAll();
  });

  it('Should set a cookie to show the user accepts specified', (done) => {
    // @ts-expect-error - we don't need to take all the params, only the ones our SUT will actually pass.
    mockCookieService.set = (name, value: string, duration: number, path: string, domain: string) => {
      expect(name).toBe('cookie-preferences');
      expect(JSON.parse(value)).toEqual({
        agreedToAll: false,
        agreedToCookieTypes: { analyticsAndTesting: true, thirdParty: false },
      });
      expect(duration).toBe(365);
      expect(path).toBe('/');
      expect(domain).toBe('localhost');

      done();
    };

    const service = new CookiePreferenceService();

    service.storePreferences({
      agreedToAll: false,
      agreedToCookieTypes: { analyticsAndTesting: true, thirdParty: false },
    });
  });
});
