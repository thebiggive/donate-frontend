import { browser, by, element } from 'protractor';

export class AppPage {
  /**
   * @param path Path to navigate to, excluding leading slash.
   */
  navigateTo(path: string) {
    return browser.get(browser.baseUrl + path) as Promise<any>;
  }

  getLogoSvgDesc() {
    return element(by.deepCss('svg > title')).getAttribute('aria-label') as Promise<string>;
  }
}
