export default {
  title: 'Components/Layout',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    columnCount: {
      name: 'Column count',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4],
      },
    },
    columnGap: {
      name: 'Column gap',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
  },
};

const Template = args => `
          <biggive-grid
            space-below="${args.spaceBelow}"  
            column-count="${args.columnCount}"    
            column-gap="${args.columnGap}">

          <biggive-campaign-card 
            campaign-type="Match Funded"
            campaign-title="Oxford Piano Festival Fundraising Campaign for LGBTQ+ community" 
            organisation-name="Oxford Philharmonic Orchestra"
            currency-code="GBP" 
            primary-figure-label="Total Raised" 
            primary-figure-amount="76543" 
            secondary-figure-label="Total Raised" 
            secondary-figure-amount="76543" 
            progress-bar-counter="75">
          </biggive-campaign-card>
          <biggive-campaign-card 
            campaign-type="Match Funded" 
            campaign-title="Oxford Piano Festival Fundraising Campaign for LGBTQ+ community" 
            organisation-name="Oxford Philharmonic Orchestra"
            currency-code="GBP" 
            primary-figure-label="Total Raised" 
            primary-figure-amount="76543" 
            secondary-figure-label="Total Raised" 
            secondary-figure-amount="76543">
          </biggive-campaign-card>
          <biggive-campaign-card 
            campaign-type="Match Funded" 
            campaign-title="Oxford Piano Festival Fundraising Campaign for LGBTQ+ community" 
            organisation-name="Oxford Philharmonic Orchestra"
            currency-code="GBP" 
            primary-figure-label="Total Raised" 
            primary-figure-amount="76543" 
            secondary-figure-label="Total Raised" 
            secondary-figure-amount="76543">
          </biggive-campaign-card>
          </biggive-grid>
          `;

export const GridComponent = Template.bind({});
GridComponent.args = {
  spaceBelow: 4,
  columnCount: '3',
  columnGap: '4',
};
