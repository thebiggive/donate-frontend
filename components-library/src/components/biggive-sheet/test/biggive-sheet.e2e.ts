import { newE2EPage } from '@stencil/core/testing';

describe('biggive-sheet', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-sheet></biggive-sheet>');

    const element = await page.find('biggive-sheet');
    expect(element).toHaveClass('hydrated');
  });
});
