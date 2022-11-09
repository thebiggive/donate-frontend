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
  @Prop() mainMessage: string = null;

  @Prop() tickerItems: { label: string; figure: string }[] = [];

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="banner">
            <div class={'main-message-wrap background-colour-' + this.secondaryColour + ' text-colour-' + this.secondaryTextColour}>{this.mainMessage}</div>
            <div class={'ticker-wrap background-colour-' + this.primaryColour + ' text-colour-' + this.primaryTextColour}>
              <div class="sleeve">
                {this.tickerItems.length === 0
                  ? undefined
                  : this.tickerItems.map(tickerItem => <biggive-totalizer-ticker-item figure={tickerItem.figure} label={tickerItem.label}></biggive-totalizer-ticker-item>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
