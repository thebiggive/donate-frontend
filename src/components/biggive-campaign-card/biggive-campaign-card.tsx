import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-campaign-card',
  styleUrl: 'biggive-campaign-card.scss',
  shadow: true,
})
export class BiggiveCampaignCard {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 4;
  /**
   * e.g. "Match Funded".
   */
  @Prop() campaignType: string = null;

  /**
   * Full URL of a banner image.
   */
  @Prop() banner: string = null;

  /**
   * Display name of the charity's specific time-bound fundraising campaign.
   */
  @Prop() campaignTitle: string = null;

  /**
   * Display name of the charity or non-profit.
   */
  @Prop() organisationName: string = null;

  /**
   * Label for the primary figure
   */
  @Prop() primaryFigureLabel: string = null;

  /**
   * Amount for the primary figure, formatted with currency symbol
   */
  @Prop() primaryFigureAmount: string = null;

  /**
   * Label for the secondary figure
   */
  @Prop() secondaryFigureLabel: string = null;

  /**
   * Amount for the secondary figure, formatted with currency symbol
   */
  @Prop() secondaryFigureAmount: string = null;

  /**
   * Progress bar percentage
   */
  @Prop() progressBarCounter: number = 100;

  /**
   * Donate button label
   */
  @Prop() donateButtonLabel: string = 'Donate now';

  /**
   * Donate button url
   */
  @Prop() donateButtonUrl: string = null;

  /**
   * Donate button colour scheme
   */
  @Prop() donateButtonColourScheme: string = 'primary';

  /**
   * More information button label
   */
  @Prop() moreInfoButtonLabel: string = 'Find out more';

  /**
   * More information button url
   */
  @Prop() moreInfoButtonUrl: string = null;

  /**
   * Donate button colour scheme
   */
  @Prop() moreInfoButtonColourScheme: string = 'clear-primary';

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow.toString()}>
        <div class="sleeve">
          {this.campaignType !== null ? (
            <div class="campaign-type">
              <span>{this.campaignType}</span>
            </div>
          ) : null}

          {this.banner !== null ? (
            <div class="image-wrap banner" role="presentation" style={{ 'background-image': 'url(' + this.banner + ')' }}></div>
          ) : (
            <div class="image-wrap banner"></div>
          )}

          <div class="title-wrap">
            <h3>{this.campaignTitle}</h3>
            <div class="organisation-name">By {this.organisationName}</div>
          </div>

          <div class="meta-wrap">
            <div class="meta-item">
              <span class="label">{this.primaryFigureLabel}</span>
              <span class="text">{this.primaryFigureAmount}</span>
            </div>
            <div class="meta-item">
              <span class="label">{this.secondaryFigureLabel}</span>
              <span class="text">{this.secondaryFigureAmount}</span>
            </div>
          </div>
          <div class="progress-bar-wrap">
            <biggive-progress-bar counter={this.progressBarCounter} colour-scheme="primary"></biggive-progress-bar>
          </div>
          <div class="button-wrap">
            <biggive-button full-width="true" colour-scheme={this.donateButtonColourScheme} url={this.donateButtonUrl} label={this.donateButtonLabel}></biggive-button>
            <biggive-button full-width="true" colour-scheme={this.moreInfoButtonColourScheme} url={this.moreInfoButtonUrl} label={this.moreInfoButtonLabel}></biggive-button>
          </div>
        </div>
      </div>
    );
  }
}
