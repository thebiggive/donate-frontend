import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';

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
  doButtonClick: EventEmitter<{ event: object; url: string }>;

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
  @Prop() url: string;

  /**
   * New Tab
   */
  @Prop() openInNewTab: boolean = false;

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

  /**
   * Centered
   */
  @Prop() centered: boolean = false;

  @Prop() buttonId: undefined | string = undefined;

  private handleButtonClick = (event: any) => {
    this.doButtonClick.emit({ event: event, url: event.target.parentElement.href });
  };

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow + ' centered-' + this.centered}>
        <a
          href={this.url}
          target={this.openInNewTab ? '_blank' : '_self'}
          id={this.buttonId}
          class={'button button-' + this.colourScheme + ' full-width-' + this.fullWidth.toString() + ' size-' + this.size + ' rounded-' + this.rounded.toString()}
        >
          <span onClick={this.handleButtonClick}>{this.label}</span>
        </a>
      </div>
    );
  }
}
