import { newSpecPage } from '@stencil/core/testing';
import { BiggiveBrandedImage } from '../biggive-branded-image';

describe('biggive-branded-image', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveBrandedImage],
      html: `<biggive-branded-image></biggive-branded-image>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-branded-image>
        <mock:shadow-root>
          <div class="container space-below-0">
            <div class="slug"></div>
            <div class="image-wrap"><img src=""></div>
            <div class="logo-wrap" style="background-image: url('');"></div>
          </div>
        </mock:shadow-root>
      </biggive-header-image>
    `);
  });
});
