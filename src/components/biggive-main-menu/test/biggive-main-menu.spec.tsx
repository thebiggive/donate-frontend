import { newSpecPage } from '@stencil/core/testing';
import { BiggiveMainMenu } from '../biggive-main-menu';

describe('biggive-main-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveMainMenu],
      html: `<biggive-main-menu></biggive-main-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-main-menu>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-main-menu>
    `);
  });
});
