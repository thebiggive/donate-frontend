import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Component, Prop, h } from '@stencil/core';
import { FontAwesomeIconsService } from '../../util/fontawesome-icons';

@Component({
  tag: 'biggive-social-icon',
  styleUrl: 'biggive-social-icon.scss',
  shadow: false,
})
export class BiggiveSocialIcon {
  /**
   * service
   */
  @Prop() service: string = 'Twitter';

  /**
   * Background colour
   */
  @Prop() backgroundColour: string = 'primary';

  /**
   * Background colour
   */
  @Prop() iconColour: string = 'white';

  /**
   * Url
   */
  @Prop() url: string = '#';

  private getSocialIcon(): IconDefinition {
    var icon = FontAwesomeIconsService.getSocialIcon(this.service);
    return icon;
  }

  render() {
    return (
      <div class={'social-icon-item background-colour-' + this.backgroundColour}>
        <a href={this.url}>
          <svg
            width={this.getSocialIcon().icon[0]}
            height={this.getSocialIcon().icon[1]}
            xmlns="http://www.w3.org/2000/svg"
            class={'fill-' + this.iconColour}
            viewBox={'0 0 ' + this.getSocialIcon().icon[0] + ' ' + this.getSocialIcon().icon[1]}
          >
            <path d={this.getSocialIcon().icon[4].toString()} />
          </svg>
        </a>
      </div>
    );
  }
}
