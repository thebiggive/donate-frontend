import { Component, h } from '@stencil/core';

@Component({
  tag: 'demo-campaign-cards',
  styleUrl: 'demo-campaign-cards.css',
  shadow: true,
})
export class DemoCampaignCards {
  render() {
    return (
      <biggive-grid>
        {[...Array(12)].map(() =>
          <biggive-campaign-card
            banner="/assets/img/banner.png"
            days-remaining={50}
            target={50000}
            organisation-name="Ardent Theatre Company"
            campaign-type="Match Funded"
            campaign-title="Strike! A play by Tracy Ryan"
            categories="Arts/Culture/Heritage|Environment/Conservation|Health/Wellbeing"
            beneficiaries="General Public/Humankind"
            match-funds-remaining={17424}
            total-funds-raised={15424}
            call-to-action-url="#"
            call-to-action-label="Donate"
          />
        )}
      </biggive-grid>
    )
  }
}
