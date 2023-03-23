import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Component, Prop, h } from '@stencil/core';
import { FontAwesomeIconsService } from '../../util/fontawesome-icons';
import { brandColour } from '../../globals/brand-colour';

@Component({
  tag: 'biggive-generic-icon',
  styleUrl: 'biggive-generic-icon.scss',
  shadow: false,
})
export class BiggiveGenericIcon {
  @Prop() backgroundColour: brandColour = 'primary';

  @Prop() iconColour: brandColour = 'white';

  @Prop() iconGroup: 'beneficiary' | 'misc' | 'social' | 'category';

  @Prop() icon: string;

  @Prop() url: string;

  private getIcon(): IconDefinition {
    let icon;
    if (this.iconGroup == 'beneficiary') {
      icon = FontAwesomeIconsService.getBeneficiaryIcon(this.icon);
    } else if (this.iconGroup == 'misc') {
      icon = FontAwesomeIconsService.getMiscIcon(this.icon);
    } else if (this.iconGroup == 'social') {
      icon = FontAwesomeIconsService.getSocialIcon(this.icon);
    } else if (this.iconGroup == 'category') {
      icon = FontAwesomeIconsService.getCategoryIcon(this.icon);
    }
    return icon;
  }

  render() {
    return (
      // Note: the icon name prop is set as a css class too for any styling specific to certain icons
      <div class={'generic-icon-item background-colour-' + this.backgroundColour + ' ' + this.icon}>
        <a href={this.url}>
          {this.getIcon() ? (
            <svg
              width={this.getIcon().icon[0]}
              height={this.getIcon().icon[1]}
              xmlns="http://www.w3.org/2000/svg"
              class={'fill-' + this.iconColour}
              viewBox={'0 0 ' + this.getIcon().icon[0] + ' ' + this.getIcon().icon[1]}
            >
              <path d={this.getIcon().icon[4].toString()} />
            </svg>
          ) : null}
        </a>
      </div>
    );
  }
}
