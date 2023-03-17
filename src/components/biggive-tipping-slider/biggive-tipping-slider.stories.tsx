export default {
  title: 'Components/Content',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    colourScheme: {
      name: 'Colour Scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    percentageStart: {
      name: 'Percentage Start',
      control: {
        type: 'number',
      },
    },
    percentageEnd: {
      name: 'Percentage End',
      control: {
        type: 'number',
      },
    },
    donationAmount: {
      name: 'Donation Amount',
      control: {
        type: 'number',
      },
    },
    donationCurrency: {
      name: 'Donation Currency',
      control: {
        type: 'select',
        options: ['GBP', 'USD'],
      },
    },
  },
};

const Template = args => `
              <biggive-tipping-slider
                space-below="${args.spaceBelow}"
                colour-scheme="${args.colourScheme}"
                percentage-start="${args.percentageStart}"
                percentage-end="${args.percentageEnd}"
                donation-amount="${args.donationAmount}"
                donation-currency="${args.donationCurrency}"
              ></biggive-tipping-slider>
              `;

export const TippingSliderComponent = Template.bind({});
TippingSliderComponent.args = {
  spaceBelow: 4,
  colourScheme: 'primary',
  percentageStart: 0,
  percentageEnd: 30,
  donationAmount: 200,
  donationCurrency: 'GBP',
};
