import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCallToAction } from '../biggive-call-to-action';

describe('biggive-call-to-action', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCallToAction],
      html: `<biggive-call-to-action></biggive-call-to-action>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-call-to-action>
        <mock:shadow-root>
          <div class="text-colour-primary container space-above-0 space-below-0">
            <div class="sleeve">
              <div class="content-wrap">
                <div class="heading-4 slug text-colour-"></div>
                <h2 class="heading-2 text-colour- title"></h2>
                <div class="heading-4 slug text-colour-"></div>
                <div class="teaser text-colour-"></div>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-call-to-action>
    `);
  });
});
