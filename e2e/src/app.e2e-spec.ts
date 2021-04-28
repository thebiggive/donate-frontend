import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Donate Frontend', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display TBG logo', () => {
    page.navigateTo('/explore');
    expect(page.getLogoAltText()).toBe('The Big Give');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser, except Stripe's
    // non-https dev warning and the expected failure to load a non-existent
    // dynamic campaign header image.
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);

    for (let ii = 0; ii < logs.length; ii++) {
      if (logs[ii].message.endsWith('live Stripe.js integrations must use HTTPS."')) {
        logs.splice(ii, 1);
      }
    }

    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
