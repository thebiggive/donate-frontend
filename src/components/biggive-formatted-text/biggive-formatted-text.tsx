import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-formatted-text',
  styleUrl: 'biggive-formatted-text.scss',
  shadow: true,
})
export class BiggiveFormattedText {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Default text colour
   */
  @Prop() defaultTextColour: string = 'primary';

  render() {
    return (
      <div class={'container text-colour-' + this.defaultTextColour + ' space-below-' + this.spaceBelow}>
        <slot></slot>
      </div>
    );
  }
}
