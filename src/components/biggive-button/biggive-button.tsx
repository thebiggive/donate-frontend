import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-button',
  styleUrl: 'biggive-button.scss',
  shadow: true,
})
export class BiggiveButton {
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

  private getClasses(): string {
    return 'button button-' + this.colourScheme;
  }

  render() {
    return (
      <a href={this.url} class={this.getClasses()} data-prop={this.colourScheme}>
        {this.label}
      </a>
    );
  }
}
