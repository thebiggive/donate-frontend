import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Component, Prop, h } from '@stencil/core';
import { FontAwesomeIconsService } from '../../util/fontawesome-icons';

@Component({
  tag: 'biggive-beneficiary-icon',
  styleUrl: 'biggive-beneficiary-icon.scss',
  shadow: false,
})
export class BiggiveBeneficiaryIcon {
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
  @Prop() icon: string = 'Other';

  /**
   * Label
   */
  @Prop() label: string;

  /**
   * Url
   */
  @Prop() url: string = '#';

  private getBeneficiaryIcon(): IconDefinition {
    var icon = FontAwesomeIconsService.getBeneficiaryIcon(this.icon);
    return icon;
  }

  render() {
    return (
      <div class="container">
        <div class={'beneficiary-icon-item background-colour-' + this.backgroundColour}>
          <a href={this.url}>
            <svg
              width={this.getBeneficiaryIcon().icon[0]}
              height={this.getBeneficiaryIcon().icon[1]}
              xmlns="http://www.w3.org/2000/svg"
              class={'fill-' + this.iconColour}
              viewBox={'0 0 ' + this.getBeneficiaryIcon().icon[0] + ' ' + this.getBeneficiaryIcon().icon[1]}
            >
              <path d={this.getBeneficiaryIcon().icon[4].toString()} />
            </svg>
          </a>
        </div>
        <div class="label">{this.label}</div>
      </div>
    );
  }
}
