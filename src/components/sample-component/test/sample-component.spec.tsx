import { newSpecPage } from '@stencil/core/testing';
import { SampleComponent } from '../sample-component';

describe('sample-component', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SampleComponent],
      html: `<sample-component></sample-component>`,
    });
    expect(page.root).toEqualHtml(`
      <sample-component>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sample-component>
    `);
  });
});
