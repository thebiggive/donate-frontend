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

  @Prop() donationCurrency: string = '£';

  componentDidRender() {
    var isMoving = false;
    var handle = this.host.shadowRoot?.querySelector<HTMLElement>('.handle');
    var bar = this.host.shadowRoot?.querySelector<HTMLElement>('.bar');
    var percentageWrap = handle?.querySelector('.percentage-value');
    var donationWrap = handle?.querySelector('.donation-value');

    var move = e => {
      if (isMoving && bar && handle && percentageWrap && donationWrap) {
        var min = 0;
        var max = bar.offsetWidth - handle.offsetWidth;
        var pageX = e.type == 'touchstart' || e.type == 'touchmove' ? e.touches[0].pageX : e.pageX;
        var mousePos = pageX - bar?.offsetLeft - handle?.offsetWidth / 2;
        var position = mousePos > max ? max : mousePos < min ? min : mousePos;
        var percentage = (position / max) * this.percentageEnd;
        var donation = Math.round(this.donationAmount * (percentage / 100));

        percentageWrap.innerHTML = Math.round(percentage).toString();
        donationWrap.innerHTML = Math.round(donation).toString();

        handle.style.marginLeft = position + 'px';
      }
    };

    bar?.addEventListener('mousedown', function (e) {
      isMoving = true;
      move(e);
    });

    document.addEventListener('mouseup', function () {
      isMoving = false;
    });

    document.addEventListener('mousemove', function (e) {
      move(e);
    });

    bar?.addEventListener('touchstart', function (e) {
      isMoving = true;
      move(e);
    });

    bar?.addEventListener('touchend', function () {
      isMoving = false;
    });

    document.addEventListener('touchmove', function (e) {
      move(e);
    });
  }

  resetSlider = () => {
    var handle = this.host.shadowRoot?.querySelector<HTMLElement>('.handle');
    var percentageWrap = handle?.querySelector('.percentage-value');
    var donationWrap = handle?.querySelector('.donation-value');

    if (handle && percentageWrap && donationWrap) {
      handle.style.marginLeft = '0px';
      percentageWrap.innerHTML = '0';
      donationWrap.innerHTML = '0';
    }
  };

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="bar">
          <div class="handle" id="handle">
            <div class="tooltip">
              <span class="donation">
                {this.donationCurrency}
                <span class="donation-value">0</span>
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
