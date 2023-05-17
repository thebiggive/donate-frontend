import { Component, Method, State, Prop, Element, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-carousel',
  styleUrl: 'biggive-carousel.scss',
  shadow: true,
})
export class BiggiveCarousel {
  @Element() host: HTMLBiggiveCarouselElement;

  @State() versions: [];
  @Prop() spaceBelow: spacingOption = 4;
  @Prop() columnCount: 1 | 2 | 3 | 4 | 5 = 3;
  @Prop() buttonBackgroundColour: brandColour = 'white';
  @Prop() buttonIconColour: brandColour = 'primary';

  currentTab = 0;
  itemCount = 0;
  itemWidthPx = 0;
  columnGapPx = 0;
  sleeve: HTMLElement;

  componentDidRender() {
    this.sleeve = this.host.shadowRoot?.querySelector<HTMLElement>('.sleeve')!;
    this.resizeToFitContent();
  }

  @Method()
  public async resizeToFitContent() {
    let children = new Array<HTMLElement>();
    Array.from(this.host.children).forEach(item => {
      if (!item.classList.contains('hidden')) {
        children.push(item as HTMLElement);
      }
    });

    this.itemCount = children.length;

    if (children.length > 0) {
      this.columnGapPx = 30;

      this.itemWidthPx = (this.sleeve.parentElement?.offsetWidth! - (this.columnCount - 1) * this.columnGapPx) / this.columnCount;

      this.sleeve.style.width = (this.itemWidthPx + this.columnGapPx) * children.length + 'px';
      this.sleeve.style.height = this.sleeve.style.height;
      this.sleeve.style.transform = 'translate3d(0px, 0, 0)';

      children.forEach(el => {
        el.style.width = this.itemWidthPx + 'px';
        el.style.marginRight = this.columnGapPx + 'px';
      });
    }
  }

  /*
   * Animates a transition to show the NEXT or PREVIOUS element in the carousel.
   * Does nothing if there is no next or previous element.
   */
  showTab(direction: 'NEXT' | 'PREV') {
    const newTab = this.currentTab + (direction === 'PREV' ? -1 : 1);

    if (newTab < 0 || newTab > this.itemCount - this.columnCount) {
      return;
    }

    const pos = 0 - (this.itemWidthPx + this.columnGapPx) * newTab;

    this.sleeve.style.transitionDuration = '0.3s';
    this.sleeve.style.transitionTimingFunction = 'ease-out';
    this.sleeve.style.transform = 'translate3d(' + pos + 'px, 0, 0)';
    this.currentTab = newTab;
  }

  clickPrevHandler = () => {
    this.showTab('PREV');
  };

  clickNextHandler = () => {
    this.showTab('NEXT');
  };

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
          <div class="button prev" onClick={this.clickPrevHandler} title="Previous">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.29311 14.5703L1.73926 8.01646L8.29311 1.46261" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
          <div class="button next" onClick={this.clickNextHandler} title="Next">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.739117 1.46094L7.29297 8.01479L0.739118 14.5686" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
