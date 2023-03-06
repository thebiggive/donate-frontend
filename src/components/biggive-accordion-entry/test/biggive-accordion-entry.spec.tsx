import { newSpecPage } from '@stencil/core/testing';
import { BiggiveAccordionEntry } from '../biggive-accordion-entry';

describe('biggive-accordion-entry', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveAccordionEntry],
      html: `<biggive-accordion-entry></biggive-accordion-entry>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-accordion-entry>
        <mock:shadow-root></mock:shadow-root>
      </biggive-accordion-entry>
    `);
  });
});
