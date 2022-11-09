import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-totalizer-ticker-item',
  styleUrl: 'biggive-totalizer-ticker-item.scss',
  shadow: true,
})
export class BiggiveTotalizerTickerItem {
  /**
   * Figure
   */
  @Prop() figure: string = null;

  /**
   * Figure
   */
  @Prop() label: string = null;

  render() {
    return (
      <div class="ticker-item">
        <strong>{this.figure}</strong> {this.label}
      </div>
    );
  }
}
