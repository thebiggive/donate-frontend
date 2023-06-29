import { Component, h, Prop } from '@stencil/core';

/**
 * Initially developed for use within the new donate stepper design. Currently has a hard-coded background
 * of $colour-grey-background, intened to appear transparent when used on a page with a matching background.
 *
 * Please ensure input is styled as width: 100%.
 */
@Component({
  tag: 'biggive-text-input',
  styleUrl: 'biggive-text-input.scss',
  shadow: true,
})
export class BiggiveTextInput {
  @Prop() value!: string;
  /**
   * ISO-4217 currency code if input is for a money value
   */
  @Prop() currency: 'GBP' | 'USD' | undefined;
  @Prop() spaceBelow: number = 0;
  @Prop() selectStyle: 'bordered' | 'underlined' = 'bordered';

  /**
   * Displayed as 'eyebrow' label over the top border of the box.
   * */
  @Prop() prompt!: string;
  render() {
    const currencySymbol = this.currency === 'GBP' ? '£' : this.currency === 'USD' ? '$' : undefined;
    return (
      <div class={'text-input space-below-' + this.spaceBelow + ' select-style-' + this.selectStyle}>
        <div class="sleeve">
          <div class="inner-sleave">
            {currencySymbol && <span class="currency-symbol">{currencySymbol}</span>}
            <slot name="input" />
            <div style={{ clear: 'both' }}></div>
          </div>
        </div>
        <div class="prompt">{this.prompt}</div>
      </div>
    );
  }
}
