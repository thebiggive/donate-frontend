import { newSpecPage } from '@stencil/core/testing';
import { BigGiveSearch } from '../biggive-search';

describe('biggive-search', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BigGiveSearch],
      html: `<biggive-search></biggive-search>`,
    });
    expect(page.root?.shadowRoot).not.toBe(null);
  });
});
