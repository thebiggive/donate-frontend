import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Component, Prop, h } from '@stencil/core';
import { FontAwesomeIconsService } from '../../util/fontawesome-icons';

@Component({
  tag: 'biggive-misc-icon',
  styleUrl: 'biggive-misc-icon.scss',
  shadow: false,
})
export class BiggiveMiscIcon {
  /**
   * Background colour
   */
  @Prop() backgroundColour: string = 'primary';

  /**
   * Background colour
   */
  @Prop() iconColour: string = 'white';

  /**
   * Icon
   */
  @Prop() icon: string = null;

  /**
   * Url
   */
  @Prop() url: string = '#';

  private getMiscIcon(): IconDefinition {
    var icon = FontAwesomeIconsService.getMiscIcon(this.icon);
    return icon;
  }

  render() {
    return (
      <div class={'misc-icon-item background-colour-' + this.backgroundColour}>
        <a href={this.url}>
          <svg
            width={this.getMiscIcon().icon[0]}
            height={this.getMiscIcon().icon[1]}
            xmlns="http://www.w3.org/2000/svg"
            class={'fill-' + this.iconColour}
            viewBox={'0 0 ' + this.getMiscIcon().icon[0] + ' ' + this.getMiscIcon().icon[1]}
          >
            <path d={this.getMiscIcon().icon[4].toString()} />
          </svg>
        </a>
      </div>
    );
  }
}
