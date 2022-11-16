import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'biggive-button',
  styleUrl: 'biggive-button.scss',
  shadow: true,
})
export class BiggiveButton {
  @Event({
    eventName: 'doButtonClick',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  doButtonClick: EventEmitter<string>;

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
  @Prop() url: string = undefined;

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
  @Prop() rounded: boolean = false;

  handleButtonClick() {
    this.doButtonClick.emit(this.url);
  }

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <a href={this.url} class={'button button-' + this.colourScheme + ' full-width-' + this.fullWidth.toString() + ' size-' + this.size + ' rounded-' + this.rounded.toString()}>
          <span onClick={this.handleButtonClick}>{this.label}</span>
        </a>
      </div>
    );
  }
}
