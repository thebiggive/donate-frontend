import { newSpecPage } from '@stencil/core/testing';
import { BiggiveImage } from '../biggive-image';

describe('biggive-image', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveImage],
      html: `<biggive-image></biggive-image>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-image>
        <mock:shadow-root>
          <div class="container space-below-0">
            <div class="image-wrap">
              <img src="">
            </div>
          </div>
        </mock:shadow-root>
      </biggive-image>
    `);
  });
});
