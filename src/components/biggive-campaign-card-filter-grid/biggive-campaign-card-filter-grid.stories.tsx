export default {
  title: 'Components/Campaign Features',
  argTypes: {
    categoryOptions: {
      name: 'Category Options',
    },
    beneficiaryOptions: {
      name: 'Beneficiary Options',
    },
    locationOptions: {
      name: 'Location Options',
    },
    fundingOptions: {
      name: 'Funding Options',
    },
    searchText: {
      name: 'Search Text',
    },
  },
};

const Template = args => `
      <biggive-campaign-card-filter-grid category-options="${args.categoryOptions}" beneficiary-options="${args.beneficiaryOptions}" location-options="${args.locationOptions}" funding-options="${args.fundingOptions}" search-text=${args.searchText}>
      <biggive-grid slot="campaign-grid" column-count="3">
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
          data-filter-categories="[&quot;Healthcare&quot;]"
          data-filter-beneficiaries="[&quot;Children&quot;]"
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
          data-filter-categories="[&quot;Healthcare&quot;]"
          data-filter-beneficiaries="[&quot;Children&quot;]"
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
      </biggive-campaign-card-filter-grid>
      `;

document.addEventListener('doSearchAndFilterUpdate', $event => console.log($event));
document.addEventListener('doClearFilters', $event => console.log($event));

export const CampaignCardFilterGridComponent = Template.bind({});
CampaignCardFilterGridComponent.args = {
  categoryOptions: ['ABC', 'DEF'],
  beneficiaryOptions: ['ABC', 'DEF'],
  locationOptions: ['ABC', 'DEF'],
  fundingOptions: ['ABC', 'DEF'],
  searchText: '',
};
