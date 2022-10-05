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
   * e.g. 'GBP'.
   */
  @Prop() currencyCode: string;

  /**
   * Match funds remaining.
   */
  @Prop() matchFundsRemaining: number = null;

  /**
   * Display name of the charity's specific time-bound fundraising campaign.
   */
  @Prop() campaignTitle: string = null;
  /**
   * e.g. "Match Funded".
   */
  @Prop() campaignType: string = null;

  /**
   * Display name of the charity or non-profit.
   */
  @Prop() organisationName: string = null;

  /**
   * Total the campaign has raised so far including matching but excluding any
   * tax relief, in major unit of currency e.g. pounds GBP.
   */
  @Prop() totalFundsRaised: number = null;

  /**
   * Donate button label
   */
  @Prop() donateButtonLabel: string = 'Donate now';

  /**
   * Donate button url
   */
  @Prop() donateButtonUrl: string = null;

  /**
   * More information button label
   */
  @Prop() moreInfoButtonLabel: string = 'Find out more';

  /**
   * More information button url
   */
  @Prop() moreInfoButtonUrl: string = null;

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

          <div class="title-wrap">
            <h3>{this.campaignTitle}</h3>
            <div class="slug">By {this.organisationName}</div>
          </div>

          <div class="meta-wrap">
            <div class="meta-item">
              <span class="label">Match Funds Remaining</span>
              <span class="text">{this.formatCurrency(this.currencyCode, this.matchFundsRemaining)}</span>
            </div>
            <div class="meta-item">
              <span class="label">
                Total Funds Received
              </span>
              <span class="text">{this.formatCurrency(this.currencyCode, this.totalFundsRaised)}</span>
            </div>
          </div>
          <biggive-progress-bar colour-scheme="primary"></biggive-progress-bar>
          <biggive-button colour-scheme="primary" url={this.donateButtonUrl} label={this.donateButtonLabel}></biggive-button>
          <biggive-button colour-scheme="clear" url={this.moreInfoButtonUrl} label={this.moreInfoButtonLabel}></biggive-button>
        </div>
      </div>
    );
  }
}
