export declare class BiggiveCampaignCardTest {
  cols: number;
  banner: string;
  daysRemaining: number;
  target: number;
  organisationName: string;
  campaignTitle: string;
  campaignType: string;
  categoryIcons: string;
  beneficiaryIcons: string;
  matchFundsRemaining: number;
  totalFundsRaised: number;
  callToActionUrl: string;
  callToActionLabel: string;
  getCategoryIcons(): string[];
  getBeneficiaryIcons(): string[];
  formatCurrency(num: any): any;
  render(): any;
}
