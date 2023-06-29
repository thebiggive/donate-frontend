import { newSpecPage } from '@stencil/core/testing';
import { BiggiveGenericIcon } from '../biggive-generic-icon';

describe('biggive-generic-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveGenericIcon],
      html: `<biggive-generic-icon></biggive-generic-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-generic-icon>
        <div class="background-colour-primary generic-icon-item undefined">
          <a></a>
        </div>
      </biggive-generic-icon>
    `);
  });
});
