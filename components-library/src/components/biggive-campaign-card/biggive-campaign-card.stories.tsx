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
    banner: {
      name: 'Banner image url',
    },
    currencyCode: {
      name: 'Currency code',
    },
    isPastCampaign: {
      name: 'Is Past Campaign',
      options: [true, false],
    },
    isFutureCampaign: {
      name: 'Is Future Campaign',
      options: [true, false],
    },
    datetime: {
      name: 'Date Time',
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
    campaignTitle: {
      name: 'Campaign title',
    },
    campaignType: {
      name: 'Campaign type',
    },
    organisationName: {
      name: 'Organisation name',
    },
    progressBarCounter: {
      name: 'Progress bar counter',
    },
    donateButtonUrl: {
      name: 'Donate button url',
    },
    donateButtonLabel: {
      name: 'Donate button label',
    },
    donateButtonColourScheme: {
      name: 'Donate button colour scheme',
      control: {
        type: 'select',
        options: [
          'primary',
          'secondary',
          'tertiary',
          'brand-1',
          'brand-2',
          'brand-3',
          'brand-4',
          'brand-5',
          'brand-6',
          'white',
          'black',
          'clear-primary',
          'clear-secondary',
          'clear-tertiary',
          'clear-brand-1',
          'clear-brand-2',
          'clear-brand-3',
          'clear-brand-4',
          'clear-brand-5',
          'clear-brand-6',
          'clear-white',
          'clear-black',
        ],
      },
    },
    moreInfoButtonUrl: {
      name: 'More info button url',
    },
    moreInfoButtonLabel: {
      name: 'More info button label',
    },
    moreInfoButtonColourScheme: {
      name: 'More info button colour scheme',
      control: {
        type: 'select',
        options: [
          'primary',
          'secondary',
          'tertiary',
          'brand-1',
          'brand-2',
          'brand-3',
          'brand-4',
          'brand-5',
          'brand-6',
          'white',
          'black',
          'clear-primary',
          'clear-secondary',
          'clear-tertiary',
          'clear-brand-1',
          'clear-brand-2',
          'clear-brand-3',
          'clear-brand-4',
          'clear-brand-5',
          'clear-brand-6',
          'clear-white',
          'clear-black',
        ],
      },
    },
  },
};

const Template = args => `
      <biggive-campaign-card
        space-below=${args.spaceBelow}
        banner="${args.banner}"
        currency-code="${args.currencyCode}"
        is-past-campaign="${args.isPastCampaign}"
        is-future-campaign="${args.isFutureCampaign}"
        datetime="${args.datetime}"
        primary-figure-label=${args.primaryFigureLabel}
        primary-figure-amount=${args.primaryFigureAmount}
        secondary-figure-label=${args.secondaryFigureLabel}
        secondary-figure-amount=${args.secondaryFigureAmount}
        campaign-title=${args.campaignTitle}
        campaign-type=${args.campaignType}
        organisation-name=${args.organisationName}
        progress-bar-counter=${args.progressBarCounter}
        donate-button-label=${args.donateButtonLabel}
        donate-button-url=${args.donateButtonUrl}
        more-info-button-label=${args.moreInfoButtonLabel}
        more-info-button-url=${args.moreInfoButtonUrl}
      </biggive-campaign-card>
      `;

export const CampaignCardComponent = Template.bind({});
CampaignCardComponent.args = {
  spaceBelow: 0,
  banner: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  currencyCode: 'GBP',
  isPastCampaign: false,
  isFutureCampaign: false,
  datetime: '29/11/2022, 12:00',
  primaryFigureLabel: 'Total raised',
  primaryFigureAmount: 1000,
  secondaryFigureLabel: 'Total remaining',
  secondaryFigureAmount: 1000,
  campaignTitle: 'My Campaign Title',
  campaignType: 'Match funding',
  organisationName: 'My Test Organisation',
  progressBarCounter: 100,
  donateButtonLabel: 'Donate now',
  donateButtonUrl: '#',
  moreInfoButtonLabel: 'More information',
  moreInfoButtonUrl: '#',
};
