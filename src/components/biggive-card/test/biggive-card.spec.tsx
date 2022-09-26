import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCard } from '../biggive-card';

describe('biggive-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCard],
      html: `<biggive-card></biggive-card>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-card>
    `);
  });
});
