import { newSpecPage } from '@stencil/core/testing';
import { BiggiveQuote } from '../biggive-quote';

describe('biggive-quote', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveQuote],
      html: `<biggive-quote></biggive-quote>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-quote>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-quote>
    `);
  });
});
