import { newSpecPage } from '@stencil/core/testing';
import { SampleComponentChild } from '../sample-component-child';

describe('sample-component-child', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SampleComponentChild],
      html: `<sample-component-child></sample-component-child>`,
    });
    expect(page.root).toEqualHtml(`
      <sample-component-child>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sample-component-child>
    `);
  });
});
