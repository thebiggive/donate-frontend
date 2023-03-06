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
  itemWidthPx = 0;
  min = 0;
  sleeve: HTMLElement;

  componentDidRender() {
    this.sleeve = this.host.shadowRoot?.querySelector<HTMLElement>('.sleeve')!;
    let children: Array<any> = Array.from(this.host.children);

    this.itemCount = children.length;

    if (children.length > 0) {
      // Item widths are set in CSS so we know they will all be the same.
      this.itemWidthPx = children[0].offsetWidth;
      this.sleeve.style.width = this.itemWidthPx * children.length + 'px';

      children.forEach(function (el) {
        el.style.width = 'calc( 100% / ' + children.length + ' )';
      });
    }

    this.min = 0 - (children.length - this.columnCount) * this.itemWidthPx;
  }

  /*
   * Animates a transition to show the NEXT or PREVIOUS element in the carousel.
   * Does nothing if there is no next or previous element.
   */
  showTab(direction: 'NEXT' | 'PREV') {
    const newTab = this.currentTab + (direction === 'PREV' ? -1 : 1);

    if (newTab < 0 || newTab > this.itemCount - 1) {
      return;
    }

    const pos = 0 - this.itemWidthPx * newTab;

    this.sleeve.style.transitionDuration = '0.3s';
    this.sleeve.style.transitionTimingFunction = 'ease-out';
    this.sleeve.style.transform = 'translate3d(' + pos + 'px, 0, 0)';
    this.currentTab = newTab;
  }

  clickPrevHandler() {
    this.showTab('PREV');
  }

  clickNextHandler() {
    this.showTab('NEXT');
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
