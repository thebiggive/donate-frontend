//import { BiggiveCampaignCard } from 'biggive-campaign-card/biggive-campaign-card';
export default {
  title: 'Components/Campaign Features',
  //subcomponents: {BiggiveCampaignCard}
};

const Template = () => `
      <biggive-campaign-card-filter-grid categoryOptions="[&quot;Children&quot;,&quot;Adults&quot;]" beneficiaryOptions="[&quot;Children&quot;,&quot;Adults&quot;]" loctionOptions="[&quot;Children&quot;,&quot;Adults&quot;]" fundingOptions="[&quot;Children&quot;,&quot;Adults&quot;]">
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
