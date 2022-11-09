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

  componentDidRender() {
    var nodes = this.host.querySelectorAll('biggive-totalizer-ticker-item');
    if (nodes.length > 0) {
      for (var prop in nodes) {
        this.host.shadowRoot.querySelector('.ticker-wrap .sleeve').appendChild(nodes[prop].shadowRoot.querySelector('.ticker-item'));
      }
    }
  }

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="banner">
            <div class={'main-message-wrap background-colour-' + this.secondaryColour + ' text-colour-' + this.secondaryTextColour}>{this.mainMessage}</div>
            <div class={'ticker-wrap background-colour-' + this.primaryColour + ' text-colour-' + this.primaryTextColour}>
              <div class="sleeve"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
