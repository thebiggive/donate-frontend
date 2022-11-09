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
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    primaryTextColour: {
      name: 'Primary text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    secondaryColour: {
      name: 'Secondary colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    secondaryTextColour: {
      name: 'Secondary text colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'white', 'black'],
      },
    },
    currencyCode: {
      name: 'Currency code',
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

              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>

              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>
              <biggive-totalizer-ticker-item figure="£1000" label="total raised"></biggive-totalizer-ticker-item>

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
};
