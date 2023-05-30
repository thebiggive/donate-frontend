import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Component, Prop, h } from '@stencil/core';
import { FontAwesomeIconsService } from '../../util/fontawesome-icons';

/**
 * Used to indicate and link to a charity's social page, or their own web site.
 */
@Component({
  tag: 'biggive-social-icon',
  styleUrl: 'biggive-social-icon.scss',
  shadow: false,
})
export class BiggiveSocialIcon {
  /**
   * Service name
   */
  @Prop() service!: 'Facebook' | 'Instagram' | 'LinkedIn' | 'Twitter' | 'Web' | 'Whatsapp' | 'YouTube';

  /**
   * Used within accessible labels for links. Typically a charity name or "Big Give". Can also be "Share".
   */
  @Prop() labelPrefix: string = 'Big Give';

  /**
   * Background colour
   */
  @Prop() backgroundColour: string = 'primary';

  /**
   * Icon colour
   */
  @Prop() iconColour: string = 'white';

  /**
   * Used in the social icons in the biggive-footer, which are more spaced out
   * than others across the site. COM-43.
   */
  @Prop() wide: boolean = false;

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
      <div class={'social-icon-item background-colour-' + this.backgroundColour + (this.wide ? ' wide' : '')}>
        <a href={this.url} aria-label={`${this.labelPrefix} on ${this.service}`} target="_blank" rel="noopener">
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
