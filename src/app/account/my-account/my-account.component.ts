import { Component, OnInit, inject } from '@angular/core';
import { PageMetaService } from '../../page-meta.service';
import { DatePipe } from '@angular/common';
import { IdentityService } from '../../identity.service';
import { Person } from '../../person.model';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HighlightCard } from '../../highlight-cards/HighlightCard';
import { environment } from '../../../environments/environment';
import { BiggivePageSection, BiggiveHeading } from '@biggive/components-angular';
import { HighlightCardsComponent } from '../../highlight-cards/highlight-cards.component';
import { flags } from '../../featureFlags';
import { codeeToCountryName } from '../../countries';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
  providers: [DatePipe],
  imports: [BiggivePageSection, BiggiveHeading, HighlightCardsComponent, RouterLink],
})
export class MyAccountComponent implements OnInit {
  private pageMeta = inject(PageMetaService);
  dialog = inject(MatDialog);
  private identityService = inject(IdentityService);
  private router = inject(Router);

  public person!: Person;
  protected readonly actions: HighlightCard[];
  protected flags = flags;
  protected codeToCountryName = codeeToCountryName;

  constructor() {
    const identityService = this.identityService;

    this.identityService = identityService;

    this.actions = [
      {
        background: {
          color: 'brand-mhf-turquoise',
          image: new URL(environment.donateUriPrefix + '/assets/images/turquoise-texture.jpg'),
        },
        headerText: 'Payment Methods',
        bodyText: 'View and manage your payment methods',
        button: {
          text: '',
          href: new URL(environment.donateUriPrefix + '/my-account/payment-methods'),
        },
      },
      {
        background: {
          color: 'brand-c4c-orange',
          image: new URL(environment.donateUriPrefix + '/assets/images/red-coral-texture.png'),
        },
        headerText: 'Your\nDonations', // line break because other headers in group are longer and take two lines
        bodyText: "View all the donations you've made while logged in",
        button: {
          text: '',
          href: new URL(environment.donateUriPrefix + '/my-account/donations'),
        },
      },
      {
        background: {
          color: 'brand-afa-pink',
          image: new URL(environment.donateUriPrefix + '/assets/images/peach-texture.jpg'),
        },
        headerText: 'Your Regular Giving',
        bodyText: 'View and manage your regular giving mandates',
        button: {
          text: '',
          href: new URL(environment.donateUriPrefix + '/my-account/regular-giving'),
        },
      },
    ];
  }

  ngOnInit() {
    this.pageMeta.setCommon(
      'My account',
      'Manage your Big Give account',
      null, // page is available to account holders only, social sharing doesn't make sense here.
    );

    this.identityService.getLoggedInPerson().subscribe(async (person: Person | null) => {
      if (!person) {
        await this.router.navigate(['']);
      } else {
        this.person = person;
      }
    });
  }

  protected readonly codeeToCountryName = codeeToCountryName;
}
