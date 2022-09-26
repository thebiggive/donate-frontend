import { newSpecPage } from '@stencil/core/testing';
import { BigiveButton } from '../bigive-button';

describe('bigive-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BigiveButton],
      html: `<bigive-button></bigive-button>`,
    });
    expect(page.root).toEqualHtml(`
      <bigive-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bigive-button>
    `);
  });
});
