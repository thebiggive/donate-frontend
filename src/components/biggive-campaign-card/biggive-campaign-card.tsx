import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { Component, Prop, h } from '@stencil/core';

import { CampaignGroupsService } from '../../util/campaign-groups';

@Component({
  tag: 'biggive-campaign-card',
  styleUrls: ['biggive-campaign-card.css'],
  shadow: true,
})
export class BiggiveCampaignCard {
  /**
   * @param {string} banner Full URL of a banner image.
   */
  @Prop() banner: string = null;

  /**
   * @param {string} number (Ceiling of) whole number of days until campaign end.
   */
  @Prop() daysRemaining: number = null;

  /**
   * @param {number} totalFundsRaised Target for the campaign including matching but excluding any
   *                                        tax relief, in major unit of currency e.g. pounds GBP.
   */
  @Prop() target: number = null;

  /**
   * @param {string} organisationName Display name of the charity or non-profit.
   */
  @Prop() organisationName: string = null;

  /**
   * @param {string} organisationName Display name of the charity's specific time-bound fundraising campaign.
   */
  @Prop() campaignTitle: string = null;

  /**
   * @param {string} campaignType e.g. "Match Funded".
   */
  @Prop() campaignType: string = null;

  /**
   * @param {string} beneficiaries Pipe (|) -separated list of full category labels.
   */
  @Prop() beneficiaries: string = null;

  /**
   * @param {string} categories Pipe (|) -separated list of full category labels.
   */
  @Prop() categories: string = null;

  /**
   * @param {number} totalFundsRaised Match funds not yet used or reserved, in major unit of currency
   *                                        e.g. pounds GBP.
   */
  @Prop() matchFundsRemaining: number = null;

  /**
   * @param {number} totalFundsRaised Total the campaign has raised so far including matching but excluding any
   *                                  tax relief, in major unit of currency e.g. pounds GBP.
   */
  @Prop() totalFundsRaised: number = null;

  /**
   * @param {string} callToActionUrl Full URL of a call to action.
   */
  @Prop() callToActionUrl: string = null;

  /**
   * @param {string} callToActionLabel Text for the link to `callToActionUrl`.
   */
  @Prop() callToActionLabel: string = null;

  private getBeneficiaryIcons(): IconDefinition[] {
    return this.beneficiaries.split('|').map(beneficiary => CampaignGroupsService.getBeneficiaryIcon(beneficiary));
  }

  private getCategoryIcons(): IconDefinition[] {
    return this.categories.split('|').map(category => CampaignGroupsService.getCategoryIcon(category));
  }

  private formatCurrency(num) {
    if (!isNaN(num)) {
      return parseInt(num).toLocaleString();
    }
    return num;
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
                <span class="label">Target:</span> <span class="text">&pound;{this.formatCurrency(this.target)}</span>
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
                <span class="text">&pound;{this.formatCurrency(this.matchFundsRemaining)}</span>
              </div>
              <div class="meta-item">
                <span class="label">
                  Total
                  <br />
                  Funds Received
                </span>
                <span class="text">&pound;{this.formatCurrency(this.totalFundsRaised)}</span>
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
