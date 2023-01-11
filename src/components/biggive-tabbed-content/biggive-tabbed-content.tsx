import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-tabbed-content',
  styleUrl: 'biggive-tabbed-content.scss',
  shadow: true,
})
export class BiggiveTabbedContent {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Default text colour
   */
  @Prop() defaultTextColour: string = 'black';

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow + ' text-colour-' + this.defaultTextColour}>
        <slot></slot>
      </div>
    );
  }
}
