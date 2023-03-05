import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTippingSlider } from '../biggive-tipping-slider';

describe('biggive-tipping-slider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTippingSlider],
      html: `<biggive-tipping-slider></biggive-tipping-slider>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-tipping-slider>
        <mock:shadow-root>
          <div class="container space-below-0">
            <div class="bar">
              <div class="handle" id="handle">
                <div class="tooltip">
                  <span class="donation">
                    £
                    <span class="donation-value">
                      0
                    </span>
                  </span>
                  <span class="percentage">
                    (
                    <span class="percentage-value">
                      0
                    </span>
                    %)
                  </span>
                </div>
              </div>
            </div>
            <div class="labels">
              <div class="label-start">
                %
              </div>
              <div class="label-end">
                %
              </div>
            </div>
            <div class="reset">
              <span class="button">
                Back to default
              </span>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-tipping-slider>
    `);
  });
});
