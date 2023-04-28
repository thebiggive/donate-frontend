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

  componentDidRender() {
    // @ts-ignore
    const tickerItemsInternalWrapper: HTMLDivElement = this.host.querySelector(`[slot="ticker-items"]`);

    // @ts-ignore
    const sleeve1: HTMLDivElement = this.host.shadowRoot?.querySelector('.ticker-wrap #sleeve_1');
    // @ts-ignore
    const sleeve2: HTMLDivElement = this.host.shadowRoot?.querySelector('.ticker-wrap #sleeve_2');

    // Clone all children of the ticker items internal wrapper and append them, so the ticker can show items without
    // a blank break. Sleeve 2 will animate on a delay per https://stackoverflow.com/a/45847760.
    tickerItemsInternalWrapper.childNodes.forEach((child: HTMLElement) => {
      sleeve2.appendChild(child.cloneNode(true)); // Deep clone all items.
    });

    if (tickerItemsInternalWrapper !== null && tickerItemsInternalWrapper !== undefined) {
      tickerItemsInternalWrapper.style.display = 'inline-flex';
      tickerItemsInternalWrapper.style.flex = 'none';
    }

    console.log('width is ' + sleeve1.clientWidth);
    console.log('duation is: ' + sleeve1.clientWidth / 50);

    const tickerWidth = sleeve1.clientWidth;
    const duration = tickerWidth / 50;
    sleeve1.style.animationDuration = Math.round(duration) + 's';
    sleeve2.style.animationDuration = Math.round(duration) + 's';
    sleeve2.style.animationDelay = Math.round(duration / 2) + 's';
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
