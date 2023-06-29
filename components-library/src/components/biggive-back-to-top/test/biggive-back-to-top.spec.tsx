import { newSpecPage } from '@stencil/core/testing';
import { BiggiveBackToTop } from '../biggive-back-to-top';

describe('biggive-back-to-top', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveBackToTop],
      html: `<biggive-back-to-top></biggive-back-to-top>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-back-to-top>
        <mock:shadow-root>
          <div class="container">
            <a href="#">
              <img src="/assets/images/triangles-combined.svg">
              <span class="text">
                Back to top
              </span>
            </a>
          </div>
        </mock:shadow-root>
      </biggive-back-to-top>
    `);
  });
});
