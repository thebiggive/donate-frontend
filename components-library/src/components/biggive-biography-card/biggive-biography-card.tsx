import { Component, Prop, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-biography-card',
  styleUrl: 'biggive-biography-card.scss',
  shadow: true,
})
export class BiggiveBiographyCard {
  @Prop() spaceBelow: spacingOption = 0;

  @Prop() borderWidth: spacingOption = 0;

  @Prop() imageUrl: string = '';

  @Prop() imageStyle: 'cover' | 'contain' = 'cover';

  @Prop() textColour: brandColour = 'black';

  @Prop() backgroundColour: brandColour = 'white';

  @Prop() fullName: string = '';

  @Prop() jobTitle: string = '';

  @Prop() textAlign: 'center' | 'left' | 'right' = 'left';

  @Prop() ratio: '1,1' | '1,1.5' | '1,2' = '1,1.5';

  @Prop() circle: boolean = false;

  @Prop() rounded: boolean = false;

  @Prop() url: string = '';

  render() {
    if (this.url != '') {
      return (
        <div class={'container space-below-' + this.spaceBelow + ' text-colour-' + this.textColour + ' text-align-' + this.textAlign}>
          <a href={this.url}>
            <div
              class={
                'sleeve circle-' +
                this.circle.toString() +
                ' border-colour-' +
                this.backgroundColour +
                ' background-colour-' +
                this.backgroundColour +
                ' border-width-' +
                this.borderWidth
              }
            >
              {this.imageUrl != '' ? (
                <div
                  data-ratio={this.ratio}
                  class={'image-wrap image-style-' + this.imageStyle + ' rounded-' + this.rounded.toString()}
                  style={{ 'background-image': "url('" + this.imageUrl + "')" }}
                >
                  <img src={this.imageUrl} alt={this.fullName} title={this.fullName} />
                  <div class="circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-color="1" stroke="#000000" d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" />
                    </svg>
                  </div>
                </div>
              ) : null}
            </div>
            <h3 class="full-name">{this.fullName}</h3>
            <div class="job-title">{this.jobTitle}</div>
          </a>
        </div>
      );
    } else {
      return (
        <div class={'container space-below-' + this.spaceBelow + ' text-colour-' + this.textColour + ' text-align-' + this.textAlign}>
          <div
            class={
              'sleeve circle-' +
              this.circle.toString() +
              ' border-colour-' +
              this.backgroundColour +
              ' background-colour-' +
              this.backgroundColour +
              ' border-width-' +
              this.borderWidth
            }
          >
            {this.imageUrl != '' ? (
              <div
                data-ratio={this.ratio}
                class={'image-wrap image-style-' + this.imageStyle + ' rounded-' + this.rounded.toString()}
                style={{ 'background-image': "url('" + this.imageUrl + "')" }}
              >
                <img src={this.imageUrl} alt={this.fullName} title={this.fullName} />
              </div>
            ) : null}
          </div>
          <h3 class="full-name">{this.fullName}</h3>
          <div class="job-title">{this.jobTitle}</div>
        </div>
      );
    }
  }
}
