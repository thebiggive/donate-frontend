export default {
  title: 'Components/Demos',
};

const Template = args => `
      <biggive-campaign-card
        banner="${args.banner}"
        currency-code="${args.currencyCode}"
        match-funds-remaining=${args.matchFundsRemaining}
        campaign-title=${args.campaignTitle}
        campaign-type=${args.campaignType}
        organisation-name=${args.organisationName}
        total-funds-raised=${args.totalFundsRaised}
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
  matchFundsRemaining: 1000,
  campaignTitle: 'My Campaign Title',
  campaignType: 'match funding',
  organisationName: 'My Test Organisation',
  totalFundsRaised: 5000,
  donateButtonLabel: 'Donate now',
  donateButtonUrl: '#',
  moreInfoButtonLabel: 'More information',
  moreInfoButtonUrl: '#',
};
