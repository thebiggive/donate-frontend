import { newSpecPage } from '@stencil/core/testing';
import { BiggiveHeader } from '../biggive-header';

describe('biggive-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveHeader],
      html: `<biggive-header></biggive-header>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-header>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-header>
    `);
  });
});
