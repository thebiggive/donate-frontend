import { Component, Element, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-totalizer',
  styleUrl: 'biggive-totalizer.scss',
  shadow: true,
})
export class BiggiveTotalizer {
  @Element() host: HTMLBiggiveTotalizerElement;
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
   * Primary message
   */
  @Prop() mainMessage: string;

  setSpeed(itemsWidth: number) {
    const sleeve1: HTMLDivElement | null | undefined = this.host.shadowRoot?.querySelector('.ticker-wrap #sleeve_1');
    const sleeve2: HTMLDivElement | null | undefined = this.host.shadowRoot?.querySelector('.ticker-wrap #sleeve_2');

    if (!sleeve1 || !sleeve2) {
      console.log('sleeve1 or sleeve2 is missing, skipping setSpeed()');
      return;
    }

    // Restart the animation(s) on window resize to reduce the chance of jankiness.
    // https://stackoverflow.com/a/45036752/2803757
    sleeve1.style.animationName = 'none';
    sleeve2.style.animationName = 'none';
    sleeve1.offsetHeight;

    const duration = sleeve1.clientWidth / 50;

    sleeve1.style.animationDuration = Math.round(duration) + 's';
    sleeve1.style.animationName = 'ticker';

    // For now, only show the 2nd copy if there's space for it to not overlap. This means
    // a bumpier loop on mobile, but we'd need a tweaked approach to wrap around cleanly
    // where the item lists doesn't fit on the screen twice. The 1.5 ratio is a trial and
    // error number which seems OK for now. It leaves a bit of a gap before items cycle
    // back in at tablet sizes but is an improvement on what we had before at all breakpoints
    // tested.
    if (itemsWidth * 1.5 < sleeve1.clientWidth) {
      sleeve2.style.animationDuration = Math.round(duration) + 's';
      sleeve2.style.animationDelay = Math.round(duration / 2) + 's';
      sleeve2.style.animationName = 'ticker';
    }
  }

  componentDidRender() {
    const tickerItemsInternalWrapper: HTMLDivElement | null = this.host.querySelector(`[slot="ticker-items"]`);
    const sleeve1: HTMLDivElement | null | undefined = this.host.shadowRoot?.querySelector('.ticker-wrap #sleeve_1');
    const sleeve2: HTMLDivElement | null | undefined = this.host.shadowRoot?.querySelector('.ticker-wrap #sleeve_2');

    if (!tickerItemsInternalWrapper || !sleeve1 || !sleeve2) {
      console.log('tickerItemsInternalWrapper, sleeve1 or sleeve2 is missing, skipping totalizer animation setup');
      return;
    }

    // Clone all children of the ticker items internal wrapper and append them, so the ticker can show items without
    // a blank break. Sleeve 2 will animate on a delay per https://stackoverflow.com/a/45847760.
    tickerItemsInternalWrapper.childNodes.forEach((child: HTMLElement) => {
      sleeve2.appendChild(child.cloneNode(true)); // Deep clone all items.
    });

    if (tickerItemsInternalWrapper !== null && tickerItemsInternalWrapper !== undefined) {
      tickerItemsInternalWrapper.style.display = 'inline-flex';
      tickerItemsInternalWrapper.style.flex = 'none';
    }

    this.setSpeed(tickerItemsInternalWrapper.clientWidth);
    window.addEventListener('resize', () => {
      this.setSpeed(tickerItemsInternalWrapper.clientWidth);
    });
  }

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div>
          <div class="banner">
            <div class={'main-message-wrap background-colour-' + this.secondaryColour + ' text-colour-' + this.secondaryTextColour}>{this.mainMessage}</div>
            <div class={'ticker-wrap background-colour-' + this.primaryColour + ' text-colour-' + this.primaryTextColour}>
              <div id="sleeve_1" class="sleeve">
                <slot name="ticker-items"></slot>
              </div>
              <div id="sleeve_2" class="sleeve sleeve-delayed-copy">
                {/* Contents are copied in TS */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
