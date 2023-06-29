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
    primaryColour: {
      name: 'Primary colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    primaryTextColour: {
      name: 'Primary text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    secondaryColour: {
      name: 'Secondary colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    secondaryTextColour: {
      name: 'Secondary text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    includingGiftAid: {
      name: 'Include Gift Aid',
    },
    totalMatchFunds: {
      name: 'Total match funds',
    },
    totalRaised: {
      name: 'Total raised',
    },
  },
};

const Template = args => `
            <biggive-totalizer
              space-below="${args.spaceBelow}"
              primary-colour="${args.primaryColour}"
              primary-text-colour="${args.primaryTextColour}"
              secondary-colour="${args.secondaryColour}"
              secondary-text-colour="${args.secondaryTextColour}"
              main-message="${args.mainMessage}">

              <div slot="ticker-items">
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
                <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              </div>
            </biggive-totalizer>
            `;

export const TotalizerComponent = Template.bind({});
TotalizerComponent.args = {
  spaceBelow: 4,
  primaryColour: 'primary',
  primaryTextColour: 'white',
  secondaryColour: 'secondary',
  secondaryTextColour: 'black',
  mainMessage: '£500 raised inc. Gift Aid',
  tickerItems: [
    {
      label: 'Total Raised',
      figure: '£1,000,000',
    },
    {
      label: 'Match Funds Remaining',
      figure: '£500,000',
    },
  ],
};
