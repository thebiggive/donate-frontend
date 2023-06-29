import { newSpecPage } from '@stencil/core/testing';
import { BiggiveForm } from '../biggive-form';

describe('biggive-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveForm],
      html: `<biggive-form></biggive-form>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-form>
    `);
  });
});
