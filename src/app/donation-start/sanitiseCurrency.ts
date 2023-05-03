/**
 * @returns Amount without any £/$s
 */
export function sanitiseCurrency(amount: string) {
  return Number((amount || '0').replace('£', '').replace('$', ''));
}
