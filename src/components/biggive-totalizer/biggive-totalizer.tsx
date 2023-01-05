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

    if (tickerItemsInternalWrapper !== null && tickerItemsInternalWrapper !== undefined) {
      tickerItemsInternalWrapper.style.display = 'inline-flex';
      tickerItemsInternalWrapper.style.flex = 'none';
    }

    // @ts-ignore
    const tickerWidth = this.host.shadowRoot.querySelector('.ticker-wrap .sleeve').clientWidth;
    const duration = tickerWidth / 50;
    // @ts-ignore
    const sleeve: HTMLElement = this.host.shadowRoot.querySelector('.ticker-wrap .sleeve');
    sleeve.style.animationDuration = Math.round(duration) + 's';
  }

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="banner">
            <div class={'main-message-wrap background-colour-' + this.secondaryColour + ' text-colour-' + this.secondaryTextColour}>{this.mainMessage}</div>
            <div class={'ticker-wrap background-colour-' + this.primaryColour + ' text-colour-' + this.primaryTextColour}>
              <div class="sleeve">
                <slot name="ticker-items"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
