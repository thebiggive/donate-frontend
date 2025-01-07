import { Component, OnInit } from '@angular/core';
import {PageMetaService} from '../page-meta.service';
import {DatePipe} from '@angular/common';
import {IdentityService} from "../identity.service";
import {Person} from "../person.model";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {flags} from "../featureFlags";
import { HighlightCard } from '../highlight-cards/HighlightCard';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
  providers: [DatePipe]
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
      'Big Give - My account',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
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
