import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTable } from '../biggive-table';

describe('biggive-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTable],
      html: `<biggive-table></biggive-table>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-table>
        <div class="body-background-colour-grey-light body-text-colour-black container header-background-colour-white header-text-colour-primary space-below-0"></div>
      </biggive-table>
    `);
  });
});
