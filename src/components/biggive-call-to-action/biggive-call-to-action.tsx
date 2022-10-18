import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-call-to-action',
  styleUrl: 'biggive-call-to-action.scss',
  shadow: true,
})
export class BiggiveCallToAction {
  /**
   * Colour Scheme
   */
  @Prop() colourScheme: string = 'primary';

  /**
   * Slug colour
   */
  @Prop() slugColour: string = '';

  /**
   * Slug
   */
  @Prop() slug: string = null;
  /**
   * Main title colour
   */
  @Prop() mainTitleColour: string = '';

  /**
   * Main title
   */
  @Prop() mainTitle: string = null;

  /**
   * Subtitle colour
   */
  @Prop() subtitleColour: string = '';

  /**
   * Subtitle
   */
  @Prop() subtitle: string = null;

  /**
   * Teaser colour
   */
  @Prop() teaserColour: string = '';

  /**
   * Teaser
   */
  @Prop() teaser: string = null;

  /**
   * Primary button Url
   */
  @Prop() primaryButtonUrl: string = null;

  /**
   * Primary button Label
   */
  @Prop() primaryButtonLabel: string = null;

  /**
   * Primary button Colour Scheme
   */
  @Prop() primaryButtonColourScheme: string = 'primary';

  /**
   * Secondary button Url
   */
  @Prop() secondaryButtonUrl: string = null;

  /**
   * Secondary button Label
   */
  @Prop() secondaryButtonLabel: string = null;

  /**
   * Secondary button Colour Scheme
   */
  @Prop() secondaryButtonColourScheme: string = 'primary';

  render() {
    return (
      <div class={'container colour-scheme-' + this.colourScheme}>
        <div class="sleeve">
          <div class="content-wrap">
            <div class={'slug text-colour-' + this.slugColour}>{this.slug}</div>
            <h2 class={'title text-colour-' + this.mainTitleColour}>{this.mainTitle}</h2>
            <div class={'slug text-colour-' + this.subtitleColour}>{this.subtitle}</div>
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
