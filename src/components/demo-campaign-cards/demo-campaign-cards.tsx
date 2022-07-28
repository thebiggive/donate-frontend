import { Component, getAssetPath, h } from '@stencil/core';
@Component({
  tag: 'demo-campaign-cards',
  styleUrl: 'demo-campaign-cards.css',
  shadow: true,
})
export class DemoCampaignCards {
  render() {
    return (
      <biggive-grid>
        {[...Array(12)].map(() => (
          <biggive-campaign-card
            banner={getAssetPath('/assets/images/banner.png')}
            daysRemaining={50}
            currencyCode="GBP"
            target={50000}
            organisationName="Ardent Theatre Company"
            campaignType="Match Funded"
            campaignTitle="Strike! A play by Tracy Ryan"
            categories={['Arts/Culture/Heritage', 'Environment/Conservation', 'Health/Wellbeing']}
            beneficiaries={['General Public/Humankind']}
            matchFundsRemaining={17424}
            totalFundsRaised={15424}
            callToActionUrl="#"
            callToActionLabel="Donate"
          />
        ))}
      </biggive-grid>
    );
  }
}
