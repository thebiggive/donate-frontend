import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { Component, Prop, h } from '@stencil/core';

import { CampaignGroupsService } from '../../util/campaign-groups';

@Component({
  tag: 'biggive-campaign-card-test',
  styleUrls: ['biggive-campaign-card-test.css'],
  shadow: true,
})
export class BiggiveCampaignCardTest {
  @Prop({ mutable: true }) banner: string = null;
  @Prop({ mutable: true }) daysRemaining: number = null;
  @Prop({ mutable: true }) target: number = null;
  @Prop({ mutable: true }) organisationName: string = null;
  @Prop({ mutable: true }) campaignTitle: string = null;
  @Prop({ mutable: true }) campaignType: string = null;
  @Prop({ mutable: true }) categories: string = null;
  @Prop({ mutable: true }) beneficiaries: string = null;
  @Prop({ mutable: true }) matchFundsRemaining: number = null;
  @Prop({ mutable: true }) totalFundsRaised: number = null;
  @Prop({ mutable: true }) callToActionUrl: string = null;
  @Prop({ mutable: true }) callToActionLabel: string = null;

  getBeneficiaryIcons(): IconDefinition[] {
    return this.beneficiaries.split('|').map(
      beneficiary => CampaignGroupsService.getBeneficiaryIcon(beneficiary)
    );
  }

  getCategoryIcons(): IconDefinition[] {
    return this.categories.split('|').map(
      category => CampaignGroupsService.getCategoryIcon(category)
    );
  }

  formatCurrency( num ) {
    if ( !isNaN(num) ) {
      return parseInt(num).toLocaleString();
    }
    return num;
  }

  render() {
    return (
      <div class="container">

      <div class="sleeve">

        <div class="campaign-type"><span>{this.campaignType}</span></div>

        {this.banner
           ? <div class="image-wrap banner" style={{'background-image' : 'url(' + this.banner + ')'}}><img src={this.banner} class="banner"/></div>
           : null
        }
        <div class="content">

          <div class="meta-wrap style-1">
            <div class="meta-item">
             <span class="label">Days Remaining:</span> <span class="text">{this.daysRemaining}</span>
            </div>
            <div class="meta-item">
             <span class="label">Target:</span> <span class="text">&pound;{this.formatCurrency(this.target)}</span>
            </div>
          </div>

          <header>
            <div class="slug">{this.organisationName}</div>
            <h3>{this.campaignTitle}</h3>
          </header>

          <div class="meta-wrap style-2">
            <div class="meta-item">
              <span class="label">Categories</span>
              <span class="text">
                {this.getCategoryIcons().map((iconDefinition: IconDefinition) =>
                  <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                    <path d={iconDefinition.icon[4].toString()} />
                  </svg>
                )}
              </span>
            </div>
            <div class="meta-item">
             <span class="label">Helping</span>
             <span class="text">
               {this.getBeneficiaryIcons().map((iconDefinition) =>
                 <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
                   <path d={iconDefinition.icon[4].toString()}/>
                 </svg>
               )}
             </span>
            </div>
          </div>

          <div class="meta-wrap style-3">
            <div class="meta-item">
             <span class="label">Match<br/>Funds Remaining</span>
             <span class="text">&pound;{this.formatCurrency(this.matchFundsRemaining)}</span>
            </div>
            <div class="meta-item">
             <span class="label">Total<br/>Funds Received</span>
             <span class="text">&pound;{this.formatCurrency(this.totalFundsRaised)}</span>
            </div>
          </div>

          <div class="button-wrap">
            <a href={this.callToActionUrl} class="call-to-action">{this.callToActionLabel}</a>
          </div>

        </div>


      </div>
      </div>
    );
  }

}
