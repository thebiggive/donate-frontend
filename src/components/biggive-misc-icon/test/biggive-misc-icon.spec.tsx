import { newSpecPage } from '@stencil/core/testing';
import { BiggiveMiscIcon } from '../biggive-misc-icon';

describe('biggive-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveMiscIcon],
      html: `<biggive-misc-icon icon="AlarmClock"></biggive-misc-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-misc-icon icon="AlarmClock">
        <div class="background-colour-primary misc-icon-item">
          <a href="#">
            <svg class="fill-white" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
              <path d="M160 25.4L14.86 146.4C5.452 131.6 0 114.1 0 95.24C0 42.64 42.64 0 95.24 0C120.2 0 143 9.638 160 25.4zM121.9 467.4L86.63 502.6C74.13 515.1 53.87 515.1 41.37 502.6C28.88 490.1 28.88 469.9 41.37 457.4L76.6 422.2C48.59 384.8 32 338.3 32 288C32 164.3 132.3 64 256 64C379.7 64 480 164.3 480 288C480 338.3 463.4 384.8 435.4 422.2L470.6 457.4C483.1 469.9 483.1 490.1 470.6 502.6C458.1 515.1 437.9 515.1 425.4 502.6L390.2 467.4C352.8 495.4 306.3 512 256 512C205.7 512 159.2 495.4 121.9 467.4zM280 184C280 170.7 269.3 160 256 160C242.7 160 232 170.7 232 184V288C232 294.4 234.5 300.5 239 304.1L287 352.1C296.4 362.3 311.6 362.3 320.1 352.1C330.3 343.6 330.3 328.4 320.1 319L280 278.1V184zM497.1 146.4L352 25.4C368.1 9.638 391.8 0 416.8 0C469.4 0 512 42.64 512 95.24C512 114 506.5 131.6 497.1 146.4z"></path>
            </svg>
          </a>
        </div>
      </biggive-misc-icon>
    `);
  });
});
