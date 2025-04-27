import {isPlatformBrowser} from '@angular/common';

/**
 * A few components need to manipulate a body class. Using technique from
 * https://stackoverflow.com/a/52293650/2526181
 */

export function addBodyClass(platformId: object, style: 'primary-colour') {
  if (isPlatformBrowser(platformId)) {
    document.body.classList.add(style);
  }
}

export function removeBodyClass(platformId: object, style: 'primary-colour') {
  if (isPlatformBrowser(platformId)) {
    document.body.classList.remove(style);
  }
}
