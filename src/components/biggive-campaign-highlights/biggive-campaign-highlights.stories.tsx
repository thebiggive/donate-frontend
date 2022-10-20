export default {
  title: 'Components/Campaign Features',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    currencyCode: {
      name: 'Currency code',
    },
    primaryFigureLabel: {
      name: 'Primary figure label',
    },
    primaryFigureAmount: {
      name: 'Primary figure amount',
    },
    secondaryFigureLabel: {
      name: 'Secondary figure label',
    },
    secondaryFigureAmount: {
      name: 'Secondary figure amount',
    },
    progressBarCounter: {
      name: 'Progress bar counter',
    },
    primaryStatIcon: {
      name: 'Primary stat icon',
      control: {
        type: 'select',
        options: ['heart', 'AlarmClock'],
      },
    },
    primaryStatText: {
      name: 'Primary stat text',
    },
    secondaryStatIcon: {
      name: 'Secondary stat icon',
      control: {
        type: 'select',
        options: ['heart', 'AlarmClock'],
      },
    },
    secondaryStatText: {
      name: 'Secondary stat text',
    },
  },
};

const Template = args => `
        <biggive-campaign-highlights
          space-below=${args.spaceBelow}
          currency-code="${args.currencyCode}"
          primary-figure-label=${args.primaryFigureLabel}
          primary-figure-amount=${args.primaryFigureAmount}
          secondary-figure-label=${args.secondaryFigureLabel}
          secondary-figure-amount=${args.secondaryFigureAmount}
          progress-bar-counter=${args.progressBarCounter}
          primary-stat-icon=${args.primaryStatIcon}
          primary-stat-text=${args.primaryStatText}
          secondary-stat-icon=${args.secondaryStatIcon}
          secondary-stat-text=${args.secondaryStatText}
        </biggive-campaign-highlights>
        `;

export const CampaignHighlightsComponent = Template.bind({});
CampaignHighlightsComponent.args = {
  spaceBelow: 0,
  currencyCode: 'GBP',
  primaryFigureLabel: 'Total raised',
  primaryFigureAmount: 1000,
  secondaryFigureLabel: 'Total remaining',
  secondaryFigureAmount: 1000,
  progressBarCounter: 100,
  primaryStatIcon: 'AlarmClock',
  primaryStatText: 'this is the text',
  secondaryStatIcon: 'Heart',
  secondaryStatText: 'this is the text',
};
