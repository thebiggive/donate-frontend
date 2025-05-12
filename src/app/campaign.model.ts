import { z } from 'zod';

const AdditionalImageUriSchema = z.object({
  uri: z.string(),
  order: z.number(),
});

const BudgetDetailSchema = z.object({
  amount: z.number(),
  description: z.string(),
});

const CharitySchema = z.object({
  id: z.string(),
  name: z.string(),
  optInStatement: z.string().nullable(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  logoUri: z.string().optional(),
  regulatorNumber: z.string(),
  regulatorRegion: z.string(),
  stripeAccountId: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string(),
});

const QuoteSchema = z.object({
  person: z.string(),
  quote: z.string(),
});

const UpdateSchema = z.object({
  content: z.string(),
  modifiedDate: z.date(),
});

const VideoSchema = z.object({
  provider: z.string(),
  key: z.string(),
});

const ParentUsesSharedFundsSchema = z.discriminatedUnion(
  'parentUsesSharedFunds',
  [
    z.object({
      parentUsesSharedFunds: z.literal(true),
      parentMatchFundsRemaining: z.number(),
    }),
    z.object({
      parentUsesSharedFunds: z.literal(false),
    }),
  ],
);

export const CampaignSchema = z
  .object({
    id: z.string(),
    aims: z.string().array(),
    amountRaised: z.number(),
    additionalImageUris: AdditionalImageUriSchema.array(),
    bannerUri: z.string(),
    beneficiaries: z.string().array(),
    budgetDetails: BudgetDetailSchema.array(),
    categories: z.string().array(),
    championName: z.string(),
    isRegularGiving: z.boolean().optional(),
    charity: CharitySchema,
    countries: z.string().array(),
    currencyCode: z.enum(['GBP', 'USD']),
    donationCount: z.number(),
    endDate: z.string(),
    impactReporting: z.string().nullable(),
    impactSummary: z.string().nullable(),
    isMatched: z.boolean(),
    matchFundsRemaining: z.number(),
    matchFundsTotal: z.number(),
    problem: z.string().nullable(),
    quotes: QuoteSchema.array(),
    ready: z.boolean(),
    solution: z.string().nullable(),
    startDate: z.string(),
    status: z.enum(['Active', 'Expired', 'Preview']),
    summary: z.string(),
    title: z.string(),
    updates: UpdateSchema.array(),
    usesSharedFunds: z.boolean(),
    alternativeFundUse: z.string().optional(),
    campaignCount: z.number().nullable(),
    championOptInStatement: z.string().nullable(),
    championRef: z.string().optional(),
    hidden: z.boolean(),
    logoUri: z.string().nullable(),
    parentAmountRaised: z.number().optional(),
    parentDonationCount: z.number().optional(),
    parentRef: z.string().optional(),
    parentTarget: z.number().optional(),
    surplusDonationInfo: z.string().nullable(),
    target: z.number().optional(),
    thankYouMessage: z.string().optional(),
    video: VideoSchema.optional(),
  })
  .and(ParentUsesSharedFundsSchema);

export type Campaign = z.infer<typeof CampaignSchema>;
