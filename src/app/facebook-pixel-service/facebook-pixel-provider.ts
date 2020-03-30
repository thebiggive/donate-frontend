import { Provider, APP_BOOTSTRAP_LISTENER, ComponentRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FacebookPixelService } from './facebook-pixel-service';

export const FacebookPixelProvider: Provider = {
  provide: APP_BOOTSTRAP_LISTENER,
  multi: true,
  useFactory: FacebookPixelRouterInitializer,
  deps: [
    FacebookPixelService,
    Router,
  ],
};

export function FacebookPixelRouterInitializer(
  $fpService: FacebookPixelService,
  $router: Router,
) {
  return async (c: ComponentRef<any>) => {
    $router
      .events
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          console.log(`Navigated to URL: ${event.url}`);
          $fpService.load();
        }
      });
  };
}