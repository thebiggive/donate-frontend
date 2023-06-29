import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTimelineEntry } from '../biggive-timeline-entry';

describe('biggive-timeline-entry', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTimelineEntry],
      html: `<biggive-timeline-entry></biggive-timeline-entry>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-timeline-entry>
        <mock:shadow-root></mock:shadow-root>
      </biggive-timeline-entry>
    `);
  });
});
