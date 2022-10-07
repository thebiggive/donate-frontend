import { newSpecPage } from '@stencil/core/testing';
import { BiggiveButton } from '../biggive-button';

describe('biggive-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveButton],
      html: `<biggive-button colour-scheme="primary" label="Donate now" url="https://www.google.com"></biggive-button>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-button colour-scheme="primary" label="Donate now" url="https://www.google.com">
        <mock:shadow-root>
          <a href="https://www.google.com" class="button button-primary" data-prop="primary">Donate now</a>
        </mock:shadow-root>
      </biggive-button>
    `);
  });
});
