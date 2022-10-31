import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-button',
  styleUrl: 'biggive-button.scss',
  shadow: true,
})
export class BiggiveButton {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 1;

  /**
   * Colour Scheme
   */
  @Prop() colourScheme: string = 'primary';

  /**
   * Text
   */
  @Prop() label: string = 'Click me';

  /**
   * URL
   */
  @Prop() url: string = '#';

  /**
   * Display full width
   */
  @Prop() fullWidth: boolean = false;

  /**
   * Size
   */
  @Prop() size: string = 'medium';

  /**
   * Rounded corners
   */
  @Prop() rounded: boolean = true;

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <a href={this.url} class={'button button-' + this.colourScheme + ' full-width-' + this.fullWidth.toString() + ' size-' + this.size + ' rounded-' + this.rounded.toString()}>
          {this.label}
        </a>
      </div>
    );
  }
}
