import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cookie-consent-banner',
  templateUrl: './cookie-consent-banner.component.html',
  styleUrls: ['./cookie-consent-banner.component.scss']
})
export class CookieConsentBannerComponent {

  protected readonly environment = environment;
}
