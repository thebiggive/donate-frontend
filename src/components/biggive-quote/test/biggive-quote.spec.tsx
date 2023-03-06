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
          <div class="container quote-icon-colour-primary space-below-0 text-colour-black">
          <div class="image-wrap">
          <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1245 0L13.7167 24H0L11.0901 0H16.1245ZM34 0L31.5923 24H17.8755L28.9657 0H34Z" fill="#2C089B"/>
          </svg>
          </div>
          <div class="quote">
          “”
          </div>
          <div class="attribution">
            -
          </div>
          </div>
        </mock:shadow-root>
      </biggive-quote>
    `);
  });
});
