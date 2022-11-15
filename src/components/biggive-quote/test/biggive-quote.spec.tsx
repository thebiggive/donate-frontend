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
          <svg class="fill-primary" height="50" viewBox="0 0 448 512" width="50" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z"></path>
          </svg>
          <div class="quote">
            ""
          </div>
          <br>
          <br>
            <div class="attribution">
              -
            </div>
          </div>
        </mock:shadow-root>
      </biggive-quote>
    `);
  });
});
