import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Component, Prop, h } from '@stencil/core';

import { CampaignGroupsService } from '../../util/campaign-groups';

@Component({
  tag: 'biggive-campaign-card',
  styleUrl: 'biggive-campaign-card.scss',
  shadow: true,
})
export class BiggiveCampaignCard {
  /**
   * Full URL of a banner image.
   */
  @Prop() banner: string = '';

  /**
   * (Ceiling of) whole number of days until campaign end.
   */
  @Prop() daysRemaining: number = null;

  /**
   * e.g. 'GBP'.
   */
  @Prop() currencyCode: string;

  /**
   * Target for the campaign including matching but excluding any
   * tax relief, in major unit of currency e.g. pounds GBP.
   */
  @Prop() target: number = null;

  /**
   * Display name of the charity or non-profit.
   */
  @Prop() organisationName: string = null;

  /**
   * Display name of the charity's specific time-bound fundraising campaign.
   */
  @Prop() campaignTitle: string = null;

  /**
   * e.g. "Match Funded".
   */
  @Prop() campaignType: string = null;

  /**
   * Array of full beneficiary labels.
   */
  @Prop() beneficiaries: string[] = [];

  /**
   * Array of full category labels.
   */
  @Prop() categories: string[] = [];

  /**
   * Match funds not yet used or reserved, in major unit of currency e.g. pounds GBP.
   */
  @Prop() matchFundsRemaining: number = null;

  /**
   * Total the campaign has raised so far including matching but excluding any
   * tax relief, in major unit of currency e.g. pounds GBP.
   */
  @Prop() totalFundsRaised: number = null;

  /**
   * Full URL of a call to action.
   */
  @Prop() callToActionUrl: string = null;

  /**
   * Text for the link to `callToActionUrl`.
   */
  @Prop() callToActionLabel: string = null;

  private getBeneficiaryIcons(): IconDefinition[] {
    return this.beneficiaries.map(beneficiary => CampaignGroupsService.getBeneficiaryIcon(beneficiary));
  }

  private getCategoryIcons(): IconDefinition[] {
    return this.categories.map(category => CampaignGroupsService.getCategoryIcon(category));
  }

  /**
   * @returns Whole large currency units (e.g. pounds) formatted with symbol.
   */
  private formatCurrency(currencyCode: string, amount: number | null): string {
    if (amount === null || isNaN(amount)) {
      return '–';
    }

    return Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  render() {
    return (
      <div class="container">
        <div class="sleeve">
          <div class="campaign-type">
            <span>{this.campaignType}</span>
          </div>

          {this.banner.length > 0 ? (
            <div class="image-wrap banner" style={{ 'background-image': 'url(' + this.banner + ')' }}>
              <img src={this.banner} class="banner" />
            </div>
          ) : null}
          <div class="content">
            <div class="meta-wrap style-1">
              <div class="meta-item">
                <span class="label">Days Remaining:</span> <span class="text">{this.daysRemaining}</span>
              </div>
              <div class="meta-item">
                <span class="label">Target:</span> <span class="text">{this.formatCurrency(this.currencyCode, this.target)}</span>
              </div>
            </div>

            <header>
              <div class="slug">{this.organisationName}</div>
              <h3>{this.campaignTitle}</h3>
            </header>

            <div class="meta-wrap style-2">
              <div class="meta-item">
                <span class="label">Categories</span>
                <span class="text">
                  {this.getCategoryIcons().map((iconDefinition: IconDefinition) => (
                    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                      <path d={iconDefinition.icon[4].toString()} />
                    </svg>
                  ))}
                </span>
              </div>
              <div class="meta-item">
                <span class="label">Helping</span>
                <span class="text">
                  {/* TODO alt and/or title text and/or a mobile tap option for icons everywhere. */}
                  {this.getBeneficiaryIcons().map(iconDefinition => (
                    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                      <path d={iconDefinition.icon[4].toString()} />
                    </svg>
                  ))}
                </span>
              </div>
            </div>

            <div class="meta-wrap style-3">
              <div class="meta-item">
                <span class="label">
                  Match
                  <br />
                  Funds Remaining
                </span>
                <span class="text">{this.formatCurrency(this.currencyCode, this.matchFundsRemaining)}</span>
              </div>
              <div class="meta-item">
                <span class="label">
                  Total
                  <br />
                  Funds Received
                </span>
                <span class="text">{this.formatCurrency(this.currencyCode, this.totalFundsRaised)}</span>
              </div>
            </div>

            <div class="button-wrap">
              <a href={this.callToActionUrl} class="call-to-action">
                {this.callToActionLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
