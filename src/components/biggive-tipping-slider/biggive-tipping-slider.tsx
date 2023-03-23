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
  @Prop() donationCurrency!: 'GBP' | 'USD';

  format(currencyCode: 'GBP' | 'USD', amount: number) {
    return Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  }

  componentDidRender() {
    var isMoving = false;
    const handle = this.host.shadowRoot?.querySelector<HTMLElement>('.handle')!;
    const bar = this.host.shadowRoot?.querySelector<HTMLElement>('.bar')!;
    const percentageWrap = handle?.querySelector('.percentage-value')!;
    const donationWrap = handle?.querySelector('.donation-value')!;

    var move = (e: MouseEvent | TouchEvent) => {
      if (isMoving) {
        const max = bar.offsetWidth - handle.offsetWidth;
        let pageX: number | undefined;

        if (window.TouchEvent && e instanceof TouchEvent) {
          pageX = e.touches[0]?.pageX;
        } else {
          // we Know e is a MouseEvent because all platforms that supports TouchEvent would also have
          // a truthy window.TouchEvent - see https://stackoverflow.com/a/32882849/2803757
          pageX = (e as MouseEvent).pageX;
        }

        if (pageX) {
          const mousePos = pageX - bar.offsetLeft - handle.offsetWidth / 2;
          const position = mousePos > max ? max : mousePos < 0 ? 0 : mousePos;
          const percentage = (position / max) * this.percentageEnd;
          const donation = Math.round(this.donationAmount * (percentage / 100));

          percentageWrap.innerHTML = Math.round(percentage).toString();
          donationWrap.innerHTML = this.format(this.donationCurrency, donation);

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
    const currencyFormatted = this.format(this.donationCurrency, 0);

    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="bar">
          <div class="handle" id="handle">
            <div class="tooltip">
              <span class="donation">
                <span class="donation-value">{currencyFormatted}</span>
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
