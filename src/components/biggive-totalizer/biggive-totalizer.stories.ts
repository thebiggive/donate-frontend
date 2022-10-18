export default {
  title: 'Components/Demos',
};

const Template = args => `
            <biggive-totalizer
              primary-colour="${args.primaryColour}"
              primary-text-colour="${args.primaryTextColour}"
              secondary-colour="${args.secondaryColour}"
              secondary-text-colour="${args.secondaryTextColour}"
              currency-code="${args.currencyCode}"
              including-gift-aid="${args.includingGiftAid}"
              total-match-funds="${args.totalMatchFunds}"
              total-raised="${args.totalRaised}"
            </biggive-totalizer>
            `;

export const TotalizerComponent = Template.bind({});
TotalizerComponent.args = {
  primaryColour: 'primary',
  primaryTextColour: 'white',
  secondaryColour: 'secondary',
  secondaryTextColour: 'black',
  currencyCode: 'GBP',
  includingGiftAid: true,
  totalMatchFunds: 1000,
  totalRaised: 500,
};
