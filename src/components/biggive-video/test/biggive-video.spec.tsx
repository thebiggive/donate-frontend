import { newSpecPage } from '@stencil/core/testing';
import { BiggiveVideo } from '../biggive-video';

describe('biggive-video', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveVideo],
      html: `<biggive-video></biggive-video>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-video>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-video>
    `);
  });
});
