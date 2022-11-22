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

  /**
   * Boolean flag telling the component if the campaign is in the future (not open yet).
   */
  @Prop() isFutureCampaign: boolean = false;

  /**
   * Boolean flag telling the component if the campaign is in the future (not open yet).
   */
  @Prop() isPastCampaign: boolean = false;

  /**
   * To be used alongside isFutureCampaign = true or isPastCampaign = true.
   * If either is true, we render out: 'Launches: ' + datetime or 'Closed: ' + datetime.
   * Preferred format: DD/MM/YYYY, HH:MM
   * DON-661.
   */
  @Prop() datetime: string;

  private handleButtonClick = (event: any) => {
    // Don't also fire e.g. `<biggive-campaign-card>` click event.
    event.stopPropagation();

    this.doButtonClick.emit({ event: event, url: event.target.parentElement.href });
  };

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        {this.isFutureCampaign || this.isPastCampaign ? (
          <div class="msg-wrapper">
            <biggive-misc-icon background-colour="white" icon-colour="black" icon="Timer"></biggive-misc-icon>
            {this.isFutureCampaign ? <p>Launches {this.datetime}</p> : <p>Closed {this.datetime}</p>}
          </div>
        ) : (
          <a
            href={this.url}
            class={'button button-' + this.colourScheme + ' full-width-' + this.fullWidth.toString() + ' size-' + this.size + ' rounded-' + this.rounded.toString()}
          >
            <span onClick={this.handleButtonClick}>{this.label}</span>
          </a>
        )}
      </div>
    );
  }
}
