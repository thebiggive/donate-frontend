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
          <div class="container space-below-0 text-colour-black">
            <div class="quote"></div>
            <div class="attribution"></div>
          </div>
        </mock:shadow-root>
      </biggive-quote>
    `);
  });
});
