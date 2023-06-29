import { newSpecPage } from '@stencil/core/testing';
import { BiggiveVideoFeature } from '../biggive-video-feature';

describe('biggive-video', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveVideoFeature],
      html: `<biggive-video-feature></biggive-video-feature>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-video-feature>
        <mock:shadow-root>
          <div class="container space-above-0 space-below-0 text-colour-primary">
            <div class="sleeve">
              <div class="content-wrap">
                <div class="slug text-colour-"></div>
                <h2 class="text-colour- title"></h2>
                <div class="teaser text-colour-"></div>
              </div>
              <div class="graphic-wrap">
                <div class="video-wrap">
                  <video controls="" src=""></video>
                </div>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-video-feature>
    `);
  });
});
