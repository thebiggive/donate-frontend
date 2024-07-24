import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ComponentsModule} from "@biggive/components-angular";
import {PageMetaService} from "../page-meta.service";
import {IdentityService} from "../identity.service";
import {DonationService} from "../donation.service";
import {Person} from "../person.model";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Donation} from "../donation.model";
import {AsyncPipe, DatePipe} from "@angular/common";
import {ExactCurrencyPipe} from "../exact-currency.pipe";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {allChildComponentImports} from "../../allChildComponentImports";

@Component({
  selector: 'app-my-donations',
  standalone: true,
  imports: [
    ...allChildComponentImports,
    AsyncPipe,
    ExactCurrencyPipe,
    DatePipe,
    MatProgressSpinner
  ],
  templateUrl: './my-donations.component.html',
  styleUrl: './my-donations.component.scss'
})
export class MyDonationsComponent implements OnInit{
  private person: Person;
  protected donations$: Observable<Donation[]>;

  constructor(
    private pageMeta: PageMetaService,
    private identityService: IdentityService,
    private donationService: DonationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {}

  ngOnInit() {
    this.pageMeta.setCommon(
      'Big Give - My donations', '', null);

    this.identityService.getLoggedInPerson().subscribe((person: Person|null) => {
      if (! person) {
        this.router.navigate(['']);
      } else {
        this.person = person;
        this.donations$ = this.donationService.getPastDonations(this.person.id);
      }
    });
  }

  displayMethodType(donation: Donation) {
    switch (donation.pspMethodType) {
      case "card": return "Card";
      case "customer_balance": return "Donation Funds"
    }
  }
}
