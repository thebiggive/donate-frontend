import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-campaign-highlights',
  styleUrl: 'biggive-campaign-highlights.scss',
  shadow: true,
})
export class BiggiveCampaignHighlights {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Full URL of a banner image.
   */
  @Prop() banner: string = '';

  /**
   * Display name of the charity's specific time-bound fundraising campaign.
   */
  @Prop() campaignTitle: string = null;

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
   * Primary stat icon
   */
  @Prop() primaryStatIcon: string = null;

  /**
   * Primary stat text
   */
  @Prop() primaryStatText: string = null;

  /**
   * Secondary stat icon
   */
  @Prop() secondaryStatIcon: string = null;

  /**
   * Secondary stat text
   */
  @Prop() secondaryStatText: string = null;

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="sleeve">
          {this.campaignTitle != null ? (
            <div class="campaign-title">
              <span>{this.campaignTitle}</span>
            </div>
          ) : null}

          {this.banner.length > 0 ? (
            <div class="image-wrap banner" style={{ 'background-image': 'url(' + this.banner + ')' }}>
              <img src={this.banner} class="banner" />
            </div>
          ) : null}

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
          <div class="stat-wrap">
            {this.primaryStatIcon != null ? (
              <div class="stat-item">
                <biggive-misc-icon icon={this.primaryStatIcon} background-colour="white" icon-colour="tertiary"></biggive-misc-icon>
                <span class="label">{this.primaryStatText}</span>
              </div>
            ) : null}
            {this.secondaryStatIcon != null ? (
              <div class="stat-item">
                <biggive-misc-icon icon={this.secondaryStatIcon} background-colour="white" icon-colour="tertiary"></biggive-misc-icon>
                <span class="label">{this.secondaryStatText}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
