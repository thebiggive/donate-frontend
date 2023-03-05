import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTab } from '../biggive-tab';

describe('biggive-tab', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTab],
      html: `<biggive-tab></biggive-tab>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-tab>
        <mock:shadow-root>
          <div class="container">
             <slot></slot>
           </div>
        </mock:shadow-root>
      </biggive-tab>
    `);
  });
});
