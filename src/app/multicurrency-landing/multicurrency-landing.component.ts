import { Component, OnInit } from '@angular/core';
import { faFacebookSquare, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-multicurrency-landing',
  templateUrl: './multicurrency-landing.component.html',
  styleUrls: ['./multicurrency-landing.component.scss'],
})
export class MulticurrencyLandingComponent implements OnInit {

  faFacebookSquare = faFacebookSquare;
  faTwitter = faTwitter;
  faInstagram = faInstagram;

  constructor() {}

  ngOnInit(): void {
  }

}
