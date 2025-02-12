import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {PageMetaService} from '../page-meta.service';
import {DatePipe} from '@angular/common';
import {IdentityService} from "../identity.service";
import {Person} from "../person.model";
import {Router} from "@angular/router";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {flags} from "../featureFlags";
import {HighlightCard} from '../highlight-cards/HighlightCard';
import {environment} from "../../environments/environment";
import {MyAccountRoutingModule} from './my-account-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HighlightCardsComponent} from '../highlight-cards/highlight-cards.component';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrl: './my-account.component.scss',
    providers: [DatePipe],
    standalone: true,
    imports: [
      FontAwesomeModule,
      HighlightCardsComponent,
      MatButtonModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      MyAccountRoutingModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyAccountComponent implements OnInit {
  public person: Person;


  protected readonly faExclamationTriangle = faExclamationTriangle;

  protected readonly flags = flags;

  protected readonly actions: HighlightCard[];

  constructor(
    private pageMeta: PageMetaService,
    public dialog: MatDialog,
    private identityService: IdentityService,
    private router: Router,
  ) {
    this.identityService = identityService;

    this.actions = [
      {
        background: {
          color: 'brand-mhf-turquoise',
          image: new URL(environment.donateUriPrefix + '/assets/images/turquoise-texture.jpg')
        },
        headerText: 'Payment Methods',
        bodyText: 'View and manage your payment methods',
        button: {
          text: '',
          href: new URL(environment.donateUriPrefix + '/my-account/payment-methods')
        }
      },
      {
        background: {
          color: 'brand-c4c-orange',
          image: new URL(environment.donateUriPrefix + '/assets/images/red-coral-texture.png')
        },
        headerText: 'Your\nDonations', // line break because other headers in group are longer and take two lines
        bodyText: 'View all the donations you\'ve made while logged in',
        button: {
          text: '',
          href: new URL(environment.donateUriPrefix + '/my-account/donations')
        }
      },
    ];
    if (flags.regularGivingEnabled) {
      this.actions.push(
        {
          background: {
            color: 'brand-afa-pink',
            image: new URL(environment.donateUriPrefix + '/assets/images/peach-texture.jpg')
          },
          headerText: "Your Regular\u00A0Giving", // u00A0 = non-breaking space. We prefer the break after "Your".
          bodyText: 'View and manage your regular giving mandates',
          button: {
            text: '',
            href: new URL(environment.donateUriPrefix + '/my-account/regular-giving')
          }
      })
    }
  }

  ngOnInit() {
    this.pageMeta.setCommon(
      'My account',
      'Manage your Big Give account',
      null, // page is available to account holders only, social sharing doesn't make sense here.
    );

    this.identityService.getLoggedInPerson().subscribe(async (person: Person|null) => {
      if (! person) {
        await this.router.navigate(['']);
      } else {
        this.person = person;
      }
    });
  }
}

export const myAccountPath = 'my-account';
