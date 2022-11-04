//import { BiggiveCampaignCard } from 'biggive-campaign-card/biggive-campaign-card';
export default {
  title: 'Components/Campaign Features',
  //subcomponents: {BiggiveCampaignCard}
};

const Template = args => `
      <biggive-campaign-card-filter-grid category-options="${args.categoryOptions}" beneficiary-options="${args.beneficaryOptions}" location-options="${args.locationOptions}" funding-options="${args.fundingOptions}">
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

document.addEventListener('doSearchAndFilterUpdate', () => alert('doSearchAndFilterUpdate event emitted!'));

export const CampaignCardFilterGridComponent = Template.bind({});
CampaignCardFilterGridComponent.args = {
  categoryOptions: ['ABC', 'DEF'],
  beneficiaryOptions: ['ABC', 'DEF'],
  locationOptions: ['ABC', 'DEF'],
  fundingOptions: ['ABC', 'DEF'],
};
