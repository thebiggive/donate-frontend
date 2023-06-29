import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-call-to-action',
  styleUrl: 'biggive-call-to-action.scss',
  shadow: true,
})
export class BiggiveCallToAction {
  /**
   * Space above component
   */
  @Prop() spaceAbove: number = 0;
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Default text colour
   */
  @Prop() defaultTextColour: string = 'primary';

  /**
   * Slug size
   */
  @Prop() slugSize: number = 4;
  /**
   * Slug colour
   */
  @Prop() slugColour: string = '';
  /**
   * Slug
   */
  @Prop() slug: string;

  /**
   * Main title colour
   */
  @Prop() mainTitleColour: string = '';
  /**
   * Main title size
   */
  @Prop() mainTitleSize: number = 2;
  /**
   * Main title
   */
  @Prop() mainTitle: string;

  /**
   * Main title size
   */
  @Prop() subtitleSize: number = 4;
  /**
   * Subtitle colour
   */
  @Prop() subtitleColour: string = '';

  /**
   * Subtitle
   */
  @Prop() subtitle: string;

  /**
   * Teaser colour
   */
  @Prop() teaserColour: string = '';

  /**
   * Teaser
   */
  @Prop() teaser: string;

  /**
   * Primary button Url
   */
  @Prop() primaryButtonUrl: string;

  /**
   * Primary button Label
   */
  @Prop() primaryButtonLabel: string;

  /**
   * Primary button Colour Scheme
   */
  @Prop() primaryButtonColourScheme: string = 'primary';

  /**
   * Secondary button Url
   */
  @Prop() secondaryButtonUrl: string;

  /**
   * Secondary button Label
   */
  @Prop() secondaryButtonLabel: string;

  /**
   * Secondary button Colour Scheme
   */
  @Prop() secondaryButtonColourScheme: string = 'primary';

  render() {
    return (
      <div class={'container text-colour-' + this.defaultTextColour + ' space-above-' + this.spaceAbove + ' space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="content-wrap">
            <div class={'slug heading-' + this.slugSize + ' text-colour-' + this.slugColour}>{this.slug}</div>
            <h2 class={'title heading-' + this.mainTitleSize + ' text-colour-' + this.mainTitleColour}>{this.mainTitle}</h2>
            <div class={'slug heading-' + this.subtitleSize + ' text-colour-' + this.subtitleColour}>{this.subtitle}</div>
            <div class={'teaser text-colour-' + this.teaserColour}>{this.teaser}</div>
            {this.primaryButtonLabel != null && this.primaryButtonUrl != null ? (
              <div class="button-wrap">
                <biggive-button colour-scheme={this.primaryButtonColourScheme} url={this.primaryButtonUrl} label={this.primaryButtonLabel}></biggive-button>
              </div>
            ) : null}
            {this.secondaryButtonLabel != null && this.secondaryButtonUrl != null ? (
              <div class="button-wrap">
                <biggive-button colour-scheme={this.secondaryButtonColourScheme} url={this.secondaryButtonUrl} label={this.secondaryButtonLabel}></biggive-button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
