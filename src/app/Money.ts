export type Money = {
  "amountInPence": number,
  "currency": "GBP" | "USD"
};

/**
 * Factor by which donations are multipled to return gift aid amounts, i.e. 25% or 0.25
 */
export const GIFT_AID_FACTOR = 0.25;
