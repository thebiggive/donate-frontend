export interface Campaign {
    id: string;
    amountRaised: number;
    additionalImageUris: Array<{uri: string, order: number}>;
    bannerUri: string;
    budgetDetails: Array<{amount: number, description: string}>;
    championName: string;
    charity: Array<{id: string, name: string}>;
    giftHandles: Array<{amount: number, description: string}>;
    isMatched: boolean;
    quotes: Array<{person: string, quote: string}>;
    summary: string;
    target: number;
    title: string;
    updates: Array<{content: string, modifiedDate: Date}>;
    video: Array<{provider: string, key: string}>;
    
}