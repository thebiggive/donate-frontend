import { newE2EPage } from '@stencil/core/testing';

describe('biggive-timeline-entry', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-timeline-entry></biggive-timeline-entry>');

    const element = await page.find('biggive-timeline-entry');
    expect(element).toHaveClass('hydrated');
  });
});
