import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-progress-bar',
  styleUrl: 'biggive-progress-bar.scss',
  shadow: true,
})
export class BiggiveProgressBar {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Colour Scheme
   */
  @Prop() colourScheme: string = 'primary';

  /**
   * Text
   */
  @Prop() counter: number = 100;

  private getPercentage(): number {
    return Math.round(this.counter);
  }

  render() {
    return (
      <div class={'progress-bar progress-bar-' + this.colourScheme + ' space-below-' + this.spaceBelow}>
        <div class="slider">
          <div class="progress" style={{ width: this.getPercentage() + '%' }}></div>
        </div>
        <div class="counter">{this.getPercentage()}%</div>
      </div>
    );
  }
}
