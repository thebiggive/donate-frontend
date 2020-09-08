export interface AnalyticsProduct {
    brand: string;
    category: string;
    id: string;
    name: string;
    price?: number;
    quantity?: number;
    variant?: string;

    // Custom dimensions – see 'config' call for setup.
    charity_campaign: string;
    gift_aid?: boolean;
    psp?: string;
}
