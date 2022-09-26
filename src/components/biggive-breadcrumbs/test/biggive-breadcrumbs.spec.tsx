import { newSpecPage } from '@stencil/core/testing';
import { BiggiveBreadcrumbs } from '../biggive-breadcrumbs';

describe('biggive-breadcrumbs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveBreadcrumbs],
      html: `<biggive-breadcrumbs></biggive-breadcrumbs>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-breadcrumbs>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-breadcrumbs>
    `);
  });
});
