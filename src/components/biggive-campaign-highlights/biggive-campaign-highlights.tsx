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
   * e.g. 'GBP'.
   */
  @Prop() currencyCode: string = 'GBP';

  /**
   * Label for the primary figure
   */
  @Prop() primaryFigureLabel: string = null;

  /**
   * Amount for the primary figure
   */
  @Prop() primaryFigureAmount: number = null;

  /**
   * Label for the secondary figure
   */
  @Prop() secondaryFigureLabel: string = null;

  /**
   * Amount for the secondary figure
   */
  @Prop() secondaryFigureAmount: number = null;

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
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="meta-wrap">
            <div class="meta-item">
              <span class="label">{this.primaryFigureLabel}</span>
              <span class="text">{this.formatCurrency(this.currencyCode, this.primaryFigureAmount)}</span>
            </div>
            <div class="meta-item">
              <span class="label">{this.secondaryFigureLabel}</span>
              <span class="text">{this.formatCurrency(this.currencyCode, this.secondaryFigureAmount)}</span>
            </div>
          </div>
          <div class="progress-bar-wrap">
            <biggive-progress-bar counter={this.progressBarCounter} colour-scheme="primary"></biggive-progress-bar>
          </div>
          <div class="stat-wrap">
            {this.primaryStatIcon != null ? (
              <div class="stat-item">
                <biggive-misc-icon icon={this.primaryStatIcon}></biggive-misc-icon>
                <span>{this.primaryStatText}</span>
              </div>
            ) : null}
            {this.secondaryStatIcon != null ? (
              <div class="stat-item">
                <biggive-misc-icon icon={this.secondaryStatIcon}></biggive-misc-icon>
                <span>{this.secondaryStatText}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
