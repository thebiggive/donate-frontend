import { newSpecPage } from '@stencil/core/testing';
import { BiggiveVideo } from '../biggive-video';

describe('biggive-video', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveVideo],
      html: `<biggive-video></biggive-video>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-video>
        <mock:shadow-root>
          <div class="container space-above-0 space-below-0">
            <div class="video-wrap">
              <video controls="" src=""></video>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-video>
    `);
  });
});
