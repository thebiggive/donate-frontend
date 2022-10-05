import { newSpecPage } from '@stencil/core/testing';
import { BiggiveSection } from '../biggive-section';

describe('biggive-section', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveSection],
      html: `<biggive-section></biggive-section>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-section>
        <mock:shadow-root>
          <div class="container">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </biggive-section>
    `);
  });
});
