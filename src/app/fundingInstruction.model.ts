/**
 * Used when transferring donation funds. See DON-532
 */
export class FundingInstruction {
  constructor(
    public object: string,
    public bank_transfer: {
      country: string;
      financial_addresses: FinancialAddress[];
      type: string;
    },
    public currency: string,
    public funding_type: string,
    public livemode: boolean,
    ) {}
}

class FinancialAddress {
  constructor(
    public sort_code: SortCode,
    public supported_networks: string[],
    public type: string
  ) {}
}

class SortCode {
  constructor (
    public account_holder_name: string,
    public account_number: string,
    public sort_code: string
  ) {}
}
