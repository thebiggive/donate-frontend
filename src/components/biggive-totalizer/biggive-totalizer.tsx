import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-totalizer',
  styleUrl: 'biggive-totalizer.scss',
  shadow: true,
})
export class BiggiveTotalizer {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Primary banner colour
   */
  @Prop() primaryColour: string = 'primary';

  /**
   * Primary text colour
   */
  @Prop() primaryTextColour: string = 'white';

  /**
   * Secondary banner colour
   */
  @Prop() secondaryColour: string = 'secondary';

  /**
   * Secondary text colour
   */
  @Prop() secondaryTextColour: string = 'black';

  /**
   * e.g. 'GBP'.
   */
  @Prop() currencyCode: string = 'GBP';

  /**
   * Include GiftAid
   */
  @Prop() includingGiftAid: boolean = true;

  /**
   * Total match funds.
   */
  @Prop() totalMatchFunds: number = null;

  /**
   * Total raised.
   */
  @Prop() totalRaised: number = null;

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
          <div class="banner">
            <div class={'total-raised-wrap background-colour-' + this.secondaryColour + ' text-colour-' + this.secondaryTextColour}>
              <span class="currency">{this.formatCurrency(this.currencyCode, this.totalRaised)}</span> raised
              {this.includingGiftAid ? <span> inc. Gift Aid</span> : null}
            </div>
            <div class={'total-matched-funds-wrap background-colour-' + this.primaryColour + ' text-colour-' + this.primaryTextColour}>
              <span class="currency">{this.formatCurrency(this.currencyCode, this.totalMatchFunds)}</span> total match funds
            </div>
          </div>
        </div>
      </div>
    );
  }
}
