import { browser, by, element } from 'protractor';

export class AppPage {
  /**
   * @param path Path to navigate to, excluding leading slash.
   */
  navigateTo(path: string) {
    return browser.get(browser.baseUrl + path) as Promise<any>;
  }

  getLogoAltText() {
    return element(by.css('a.logo__link > img')).getAttribute('alt') as Promise<string>;
  }
}
