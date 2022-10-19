import { newSpecPage } from '@stencil/core/testing';
import { BiggivePageColumns } from '../biggive-page-columns';

describe('biggive-page-columns', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggivePageColumns],
      html: `<biggive-page-columns></biggive-page-columns>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-page-columns>
        <mock:shadow-root>
          <div class="container space-below-0">
            <div class="columns">
              <div class="column-primary">
                <slot name="column-primary"></slot>
              </div>
              <div class="column-secondary">
                <slot name="column-secondary"></slot>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-page-columns>
    `);
  });
});
