import { newSpecPage } from '@stencil/core/testing';
import { BiggiveImageFeature } from '../biggive-image-feature';

describe('biggive-graphic', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveImageFeature],
      html: `<biggive-image-feature></biggive-image-feature>`,
    });
    expect(page.root).toEqualHtml(`
    <biggive-image-feature>
      <mock:shadow-root>
        <div class="container space-below-0 text-colour-primary">
          <div class="sleeve">
            <div class="content-wrap">
              <div class="slug text-colour-"></div>
              <h2 class="text-colour- title"></h2>
              <div class="teaser text-colour-"></div>
            </div>
            <div class="graphic-wrap">
              <div class="image-wrap">
                <img alt="" src="">
              </div>
            </div>
          </div>
        </div>
      </mock:shadow-root>
    </biggive-image-feature>
    `);
  });
});
