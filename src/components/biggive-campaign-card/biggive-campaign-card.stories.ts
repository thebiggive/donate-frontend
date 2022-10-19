export default {
  title: 'Components/Demos',
};

const Template = args => `
      <biggive-campaign-card
        banner="${args.banner}"
        currency-code="${args.currencyCode}"
        primary-figure-label=${args.primaryFigureLabel}
        primary-figure-amount=${args.primaryFigureAmount}
        secondary-figure-label=${args.secondaryFigureLabel}
        secondary-figure-amount=${args.secondaryFigureAmount}
        campaign-title=${args.campaignTitle}
        campaign-type=${args.campaignType}
        organisation-name=${args.organisationName}
        total-funds-raised=${args.totalFundsRaised}
        progress-bar-counter=${args.progressBarCounter}
        donate-button-label=${args.donateButtonLabel}
        donate-button-url=${args.donateButtonUrl}
        more-info-button-label=${args.moreInfoButtonLabel}
        more-info-button-url=${args.moreInfoButtonUrl}
      </biggive-campaign-card>
      `;

export const CampaignCardComponent = Template.bind({});
CampaignCardComponent.args = {
  banner: 'https://media.istockphoto.com/vectors/childish-seamless-dotted-pattern-with-colorful-doodle-letters-fun-vector-id1208462693',
  currencyCode: 'GBP',
  primaryFigureLabel: 'Total raised',
  primaryFigureAmount: 1000,
  secondaryFigureLabel: 'Total remaining',
  secondaryFigureAmount: 1000,
  campaignTitle: 'My Campaign Title',
  campaignType: 'match funding',
  organisationName: 'My Test Organisation',
  progressBarCounter: 100,
  donateButtonLabel: 'Donate now',
  donateButtonUrl: '#',
  moreInfoButtonLabel: 'More information',
  moreInfoButtonUrl: '#',
};
