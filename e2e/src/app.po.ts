import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getLogoAltText() {
    return element(by.css('a.logo__link > img')).getAttribute('alt') as Promise<string>;
  }
}
