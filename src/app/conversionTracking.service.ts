import {MatomoTracker} from "ngx-matomo";
import {Injectable} from "@angular/core";
import {Donation} from "./donation.model";
import {Campaign} from "./campaign.model";

@Injectable({
  providedIn: 'root',
})
export class ConversionTrackingService {
  constructor(
    private matomoTracker: MatomoTracker,
  ) {
  }

  public convert(donation: Donation, campaign: Campaign) {
    this.trackConversionWithMatomo(donation, campaign);
  }

  private trackConversionWithMatomo(donation: Donation, campaign: Campaign) {
    if (!donation?.donationId) {
      return;
    }

    this.matomoTracker.addEcommerceItem(
      `campaign-${campaign.id}`,
      `Donation to ${campaign.charity.name} for ${campaign.title}`,
      'Campaign charity donations',
      donation.donationAmount,
    );

    if (donation.tipAmount > 0) {
      this.matomoTracker.addEcommerceItem(
        'tip',
        'Big Give tip',
        'Platform tip donations',
        donation.tipAmount,
      );
    }

    if (donation.feeCoverAmount > 0) {
      this.matomoTracker.addEcommerceItem(
        'fee-cover',
        'Big Give platform fee cover',
        'Processing fees',
        donation.feeCoverAmount,
      );
    }

    // "Tracks an Ecommerce order, including any eCommerce item previously added to the order."
    this.matomoTracker.trackEcommerceOrder(
      donation.donationId,
      donation.donationAmount + donation.tipAmount + donation.feeCoverAmount,
      donation.donationAmount,
    );
  }
}
