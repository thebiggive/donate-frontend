import { Component, Prop, Element, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-carousel',
  styleUrl: 'biggive-carousel.scss',
  shadow: true,
})
export class BiggiveCarousel {
  @Element() host: HTMLBiggiveCarouselElement;

  @Prop() spaceBelow: spacingOption = 4;

  @Prop() columnCount: number = 3;

  @Prop() buttonBackgroundColour: brandColour = 'white';

  @Prop() buttonIconColour: brandColour = 'primary';

  currentTab = 0;
  itemCount = 0;
  itemWidth = 0;
  max = 0;
  min = 0;
  sleeve;

  componentDidRender() {
    this.sleeve = this.host.shadowRoot?.querySelector<HTMLElement>('.sleeve');
    let children: Array<any> = Array.from(this.host.children);

    this.itemCount = children.length;

    if (children.length > 0 && this.sleeve) {
      this.itemWidth = children[0].offsetWidth;
      this.sleeve.style.width = this.itemWidth * children.length + 'px';

      children.forEach(function (el) {
        el.style.width = 'calc( 100% / ' + children.length + ' )';
      });
    }

    this.max = 0;
    this.min = 0 - (children.length - this.columnCount) * this.itemWidth;
  }

  showTab(i: number) {
    let pos = 0 - this.itemWidth * (this.currentTab + i);

    console.log(pos);

    if (pos >= this.min && pos <= this.max) {
      this.sleeve.style.transitionDuration = '0.3s';
      this.sleeve.style.transitionTimingFunction = 'ease-out';
      this.sleeve.style.transform = 'translate3d(' + pos + 'px, 0, 0)';
      this.currentTab += i;
    }
  }

  clickPrevHandler() {
    this.showTab(-1);
  }

  clickNextHandler() {
    this.showTab(1);
  }

  render() {
    return (
      <div
        class={
          'container column-count-' +
          this.columnCount +
          ' space-below-' +
          this.spaceBelow +
          ' button-background-colour-' +
          this.buttonBackgroundColour +
          ' button-icon-colour-' +
          this.buttonIconColour
        }
      >
        <div class="items">
          <div class="sleeve">
            <slot></slot>
          </div>
        </div>

        <div class="navigation">
          <div class="button prev" onClick={() => this.clickPrevHandler()} title="Previous">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.29311 14.5703L1.73926 8.01646L8.29311 1.46261" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
          <div class="button next" onClick={() => this.clickNextHandler()} title="Next">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.739117 1.46094L7.29297 8.01479L0.739118 14.5686" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
