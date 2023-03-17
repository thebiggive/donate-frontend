import { Component, Element, Prop, h } from '@stencil/core';
import { spacingOption } from '../../globals/spacing-option';
import { brandColour } from '../../globals/brand-colour';

@Component({
  tag: 'biggive-tipping-slider',
  styleUrl: 'biggive-tipping-slider.scss',
  shadow: true,
})
export class BiggiveTippingSlider {
  @Element() host: HTMLBiggiveTippingSliderElement;

  @Prop() spaceBelow: spacingOption = 0;

  @Prop() colourScheme: brandColour = 'primary';

  @Prop() percentageStart: number;

  @Prop() percentageEnd: number;

  @Prop() donationAmount: number;

  /**
   * ISO-4217 currency code (e.g. GBP, USD)
   */
  @Prop() donationCurrency!: string;

  componentDidRender() {
    var isMoving = false;
    const handle = this.host.shadowRoot?.querySelector<HTMLElement>('.handle')!;
    const bar = this.host.shadowRoot?.querySelector<HTMLElement>('.bar')!;
    const percentageWrap = handle?.querySelector('.percentage-value')!;
    const donationWrap = handle?.querySelector('.donation-value')!;

    var move = (e: MouseEvent | TouchEvent) => {
      if (isMoving) {
        const max = bar.offsetWidth - handle.offsetWidth;
        const pageX = (window.TouchEvent && e instanceof TouchEvent) ? e.touches[0]?.pageX : (e as MouseEvent).pageX;

        if (typeof pageX != 'undefined') {
          const mousePos = pageX - bar.offsetLeft - handle.offsetWidth / 2;
          const position = mousePos > max ? max : mousePos < 0 ? 0 : mousePos;
          const percentage = (position / max) * this.percentageEnd;
          const donation = Math.round(this.donationAmount * (percentage / 100));

          percentageWrap.innerHTML = Math.round(percentage).toString();
          donationWrap.innerHTML = Math.round(donation).toString();

          handle.style.marginLeft = position + 'px';
        }
      }
    };

    bar.addEventListener('mousedown', function (e) {
      isMoving = true;
      move(e);
    });

    document.addEventListener('mouseup', function () {
      isMoving = false;
    });

    document.addEventListener('mousemove', function (e) {
      move(e);
    });

    bar.addEventListener('touchstart', function (e) {
      isMoving = true;
      move(e);
    });

    bar.addEventListener('touchend', function () {
      isMoving = false;
    });

    document.addEventListener('touchmove', function (e) {
      move(e);
    });
  }

  resetSlider = () => {
    const handle = this.host.shadowRoot?.querySelector<HTMLElement>('.handle')!;
    const percentageWrap = handle?.querySelector('.percentage-value')!;
    const donationWrap = handle?.querySelector('.donation-value')!;

    handle.style.marginLeft = '0px';
    percentageWrap.innerHTML = '0';
    donationWrap.innerHTML = '0';
  };

  render() {
    const currencySymbol = Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: this.donationCurrency,
    })
      .format(0)
      .replace(/[0\.]/g, '');

    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="bar">
          <div class="handle" id="handle">
            <div class="tooltip">
              <span class="donation">
                {currencySymbol}<span class="donation-value">0</span>
              </span>
              &nbsp;
              <span class="percentage">
                (<span class="percentage-value">0</span>%)
              </span>
            </div>
          </div>
        </div>
        <div class="labels">
          <div class="label-start">{this.percentageStart}%</div>
          <div class="label-end">{this.percentageEnd}%</div>
        </div>
        <div class="reset">
          <span class="button" onClick={this.resetSlider}>
            Back to default
          </span>
        </div>
      </div>
    );
  }
}
