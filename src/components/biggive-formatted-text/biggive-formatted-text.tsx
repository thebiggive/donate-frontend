import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-formatted-text',
  styleUrl: 'biggive-formatted-text.css',
  shadow: true,
})
export class BiggiveFormattedText {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  render() {
    return <div class={'container space-below-' + this.spaceBelow}></div>;
  }
}
