import { Component,  OnInit } from '@angular/core';
import { PageMetaService } from '../page-meta.service';
import { DatePipe } from '@angular/common';
import {IdentityService} from "../identity.service";
import {Person} from "../person.model";
import {Router} from "@angular/router";
import {PaymentMethod, Source} from "@stripe/stripe-js";
import {DonationService} from "../donation.service";
import {flags, flagsForEnvironment} from "../featureFlags";
import {environment as ProductionEnvironment} from "../../environments/environment.production";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  providers: [DatePipe]
})
export class MyAccountComponent implements OnInit {
  public person: Person;

  public paymentMethods: PaymentMethod[]|undefined = undefined;

  public isHiddenByFlag: boolean = flags.profilePageEnabled &&
    !flagsForEnvironment(ProductionEnvironment).profilePageEnabled;

  constructor(
    private pageMeta: PageMetaService,
    private identityService: IdentityService,
    private donationService: DonationService,
    private router: Router,
  ) {
    this.identityService = identityService;
  }

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give - My account',
      'Big Give – discover campaigns and donate',
      'https://images-production.thebiggive.org.uk/0011r00002IMRknAAH/CCampaign%20Banner/db3faeb1-d20d-4747-bb80-1ae9286336a3.jpg',
    );

    this.identityService.getLoggedInPerson().subscribe((person: Person|null) => {
      if (! person) {
        this.router.navigate(['']);
      } else {
        this.person = person;
        this.loadPaymentMethods();
      }
    });
  }

  loadPaymentMethods() {
    // not so keen on the component using the donation service and the identity service together like this
    // would rather call one service and have it do everything for us. Not sure what service would be best to put
    // this code in.
    this.donationService.getPaymentMethods(this.person.id, this.jwtAsString())
      .subscribe((response: { data: PaymentMethod[] }) => {
          this.paymentMethods = response.data;
        }
      );
  }

  logout() {
    this.identityService.clearJWT();
    this.router.navigate(['']);
  }

  deleteMethod(method: PaymentMethod) {
    this.paymentMethods = undefined;

    this.donationService.deleteStripePaymentMethod(this.person, method, this.jwtAsString()).subscribe(
      this.loadPaymentMethods.bind(this),
      error => {
        this.loadPaymentMethods.bind(this)()
        alert(error.error.error)
      }
    )
  }

  private jwtAsString() {
    return this.identityService.getJWT() as string;
  }
}
