import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Component, Prop, h } from '@stencil/core';
import { FontAwesomeIconsService } from '../../util/fontawesome-icons';

@Component({
  tag: 'biggive-category-icon',
  styleUrl: 'biggive-category-icon.scss',
  shadow: false,
})
export class BiggiveCategoryIcon {
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
  @Prop() icon: string;

  /**
   * Label
   */
  @Prop() label: string;

  /**
   * Url
   */
  @Prop() url: string = '#';

  private getCategoryIcon(): IconDefinition {
    var icon = FontAwesomeIconsService.getCategoryIcon(this.icon);
    return icon;
  }

  render() {
    return (
      <div class="container">
        <div class={'category-icon-item background-colour-' + this.backgroundColour}>
          <a href={this.url}>
            <svg
              width={this.getCategoryIcon().icon[0]}
              height={this.getCategoryIcon().icon[1]}
              xmlns="http://www.w3.org/2000/svg"
              class={'fill-' + this.iconColour}
              viewBox={'0 0 ' + this.getCategoryIcon().icon[0] + ' ' + this.getCategoryIcon().icon[1]}
            >
              <path d={this.getCategoryIcon().icon[4].toString()} />
            </svg>
          </a>
        </div>
        <div class="label">{this.label}</div>
      </div>
    );
  }
}
