/**
 * Used when transferring donation funds. See DON-532
 */
export type FundingInstruction = {
    object: string,
    bank_transfer: {
      country: string;
      financial_addresses: FinancialAddress[];
      type: string;
    },
    currency: string,
    funding_type: string,
    livemode: boolean,
}

type FinancialAddress = {
     sort_code: SortCode,
     supported_networks: string[],
     type: string
}

type SortCode = {
    account_holder_name: string,
    account_number: string,
    sort_code: string
}
