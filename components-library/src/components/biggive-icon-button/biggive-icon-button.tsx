import { Component, Event, EventEmitter, Prop, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-icon-button',
  styleUrl: 'biggive-icon-button.scss',
  shadow: true,
})
export class BiggiveIconButton {
  @Event({
    eventName: 'doButtonClick',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  doButtonClick: EventEmitter<{ event: object; url: string }>;

  @Prop() spaceBelow: spacingOption = 1;

  @Prop() backgroundColour: brandColour = 'white';

  @Prop() backgroundPadding: spacingOption = 0;

  @Prop() text: string;

  @Prop() textColour: brandColour = 'black';

  @Prop() iconGroup: 'beneficiary' | 'misc' | 'social' | 'category';

  @Prop() icon: string;

  @Prop() url: string;

  @Prop() openInNewTab: boolean = false;

  @Prop() size: 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' = 'medium';

  @Prop() arrow: boolean = false;

  @Prop() arrowColour: brandColour = 'black';

  @Prop() circle: boolean = false;

  @Prop() shadow: boolean = false;

  @Prop() centered: boolean = false;

  @Prop() rounded: boolean = false;

  @Prop() buttonId: undefined | string = undefined;

  private handleButtonClick = (event: any) => {
    this.doButtonClick.emit({ event: event, url: event.target.parentElement.href });
  };

  render() {
    return (
      <div
        class={
          'container space-below-' +
          this.spaceBelow +
          ' background-colour-' +
          this.backgroundColour +
          ' background-padding-' +
          this.backgroundPadding +
          ' centered-' +
          this.centered +
          ' rounded-' +
          this.rounded +
          ' shadow-' +
          this.shadow
        }
      >
        <a href={this.url} target={this.openInNewTab ? '_blank' : '_self'} id={this.buttonId}>
          <div class="sleeve" onClick={this.handleButtonClick}>
            <div class={'icon-wrap ' + ' size-' + this.size + ' circle-' + this.circle.toString()}>
              <biggive-generic-icon iconGroup={this.iconGroup} icon={this.icon}></biggive-generic-icon>
            </div>

            {this.text != '' ? <div class={'text-wrap text-colour-' + this.textColour + ' text-padding-' + this.backgroundPadding}>{this.text}</div> : null}

            {this.arrow ? (
              <div class={'arrow-wrap arrow-colour-' + this.arrowColour}>
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.76912 1.0791L5.73828 6.04826L0.769121 11.0174" stroke="black" stroke-width="2" />
                </svg>
              </div>
            ) : null}
          </div>
        </a>
      </div>
    );
  }
}
