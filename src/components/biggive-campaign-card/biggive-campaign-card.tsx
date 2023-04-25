import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

@Component({
  tag: 'biggive-campaign-card',
  styleUrl: 'biggive-campaign-card.scss',
  shadow: true,
})
export class BiggiveCampaignCard {
  @Event({
    eventName: 'doCardGeneralClick',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  doCardGeneralClick: EventEmitter<{ event: object; url: string }>;

  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 4;
  /**
   * e.g. "Match Funded".
   */
  @Prop() campaignType: string;

  /**
   * Full URL of a banner image.
   */
  @Prop() banner: string;

  /**
   * Display name of the charity's specific time-bound fundraising campaign.
   */
  @Prop() campaignTitle: string;

  /**
   * Display name of the charity or non-profit.
   */
  @Prop() organisationName: string;

  /**
   * Label for the primary figure
   */
  @Prop() primaryFigureLabel: string;

  /**
   * Amount for the primary figure, formatted with currency symbol
   */
  @Prop() primaryFigureAmount: string;

  /**
   * Label for the secondary figure
   */
  @Prop() secondaryFigureLabel: string;

  /**
   * Amount for the secondary figure, formatted with currency symbol
   */
  @Prop() secondaryFigureAmount: string;

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
  @Prop() donateButtonUrl: string;

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
  @Prop() moreInfoButtonUrl: string;

  /**
   * Donate button colour scheme
   */
  @Prop() moreInfoButtonColourScheme: string = 'clear-primary';

  /**
   * Boolean flag telling the component if the campaign is in the future (not open yet).
   */
  @Prop() isFutureCampaign: boolean = false;

  /**
   * Boolean flag telling the component if the campaign is in the future (not open yet).
   */
  @Prop() isPastCampaign: boolean = false;

  /**
   * To be used alongside isFutureCampaign = true or isPastCampaign = true.
   * If either is true, we render out: 'Launches: ' + datetime or 'Closed: ' + datetime.
   * Preferred format: DD/MM/YYYY, HH:MM
   * DON-661.
   */
  @Prop() datetime: string;

  private handleCardGeneralClick = (event: any) => {
    this.doCardGeneralClick.emit({ event, url: this.moreInfoButtonUrl });
  };

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow.toString()}>
        <div class="sleeve">
          <div onClick={this.handleCardGeneralClick}>
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
          </div>
          <div class="button-wrap">
            {this.isFutureCampaign || this.isPastCampaign ? (
              <div class="msg-wrapper">
                <biggive-misc-icon background-colour="white" icon-colour="black" icon="Timer"></biggive-misc-icon>
                {this.isFutureCampaign ? <p>Launches {this.datetime}</p> : <p>Closed {this.datetime}</p>}
              </div>
            ) : (
              <biggive-button full-width="true" colour-scheme={this.donateButtonColourScheme} url={this.donateButtonUrl} label={this.donateButtonLabel}></biggive-button>
            )}
            <biggive-button full-width="true" colour-scheme={this.moreInfoButtonColourScheme} url={this.moreInfoButtonUrl} label={this.moreInfoButtonLabel}></biggive-button>
          </div>
        </div>
      </div>
    );
  }
}
