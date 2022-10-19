import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-heading',
  styleUrl: 'biggive-heading.scss',
  shadow: true,
})
export class BiggiveHeading {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Colour Scheme
   */
  @Prop() colour: string = 'primary';

  /**
   * HTML element
   */
  @Prop() htmlElement: string = 'h1';

  /**
   * Heading size
   */
  @Prop() size: number = 1;

  /**
   * Heading text
   */
  @Prop() text: string = '';

  render() {
    const Tag = this.htmlElement;
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <Tag class={'heading-colour-' + this.colour + ' heading-size-' + this.size}>{this.text}</Tag>
      </div>
    );
  }
}
