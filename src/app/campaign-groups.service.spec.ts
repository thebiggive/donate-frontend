import { faBaby, faPlus } from '@fortawesome/free-solid-svg-icons';

import { CampaignGroupsService } from './campaign-groups.service';

describe('CampaignGroupsService', () => {
  it('should look up a beneficiary icon', () => {
    expect(CampaignGroupsService.getBeneficiaryIcon('Infants (<2)')).toBe(faBaby);
  });

  it('should look up a category icon', () => {
    expect(CampaignGroupsService.getCategoryIcon('Other')).toBe(faPlus);
  });
});
