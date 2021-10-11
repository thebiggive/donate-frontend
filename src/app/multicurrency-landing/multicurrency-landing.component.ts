import { Component } from '@angular/core';
import { faFacebookSquare, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-multicurrency-landing',
  templateUrl: './multicurrency-landing.component.html',
  styleUrls: ['./multicurrency-landing.component.scss'],
})
export class MulticurrencyLandingComponent {
  faFacebookSquare = faFacebookSquare;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
}
