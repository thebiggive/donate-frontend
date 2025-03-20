import {Money} from "./Money";

type errorDetail = {
  message?: string;
  publicMessage?: string;
  description?: string
  type: string
  htmlDescription?: string
};

export type InsufficientFundsDetail = errorDetail & {
  type: 'INSUFFICIENT_MATCH_FUNDS',

  /**
   * The maximum donation amount that would have been matchable
   */
  maxMatchable: Money
};

/**
 * An error returned from an HTTP request to our backend, e.g. matchbot, identity or Salesforce.
 *
 * Similar to Angular's HttpErrorResponse but without any `any`, and with only properties we use.
 */
export type BackendError = {
  error: {
    error: errorDetail
  }
  message: string
};

export type InsufficientMatchFundsError = BackendError &
  {
    error: {
      error: InsufficientFundsDetail
    }
  };

export function errorDescription(error: BackendError|unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (typeof error != 'object') {
    return 'Sorry, something went wrong';
  }

  // @ts-expect-error
  const errorDetail = error?.error.error;

  return errorDetail.description
    || errorDetail.publicMessage
    || errorDetail.message
    // @ts-expect-error
    || error?.message
    || 'Sorry, something went wrong'
}

export function errorDetails<T extends BackendError>(error: T): T extends InsufficientMatchFundsError ? InsufficientFundsDetail : errorDetail {
  return error.error.error as T extends InsufficientMatchFundsError ? InsufficientFundsDetail : errorDetail;
}

export function isInsufficientMatchFundsError(error: BackendError): error is InsufficientMatchFundsError {
  return error.error.error.type === 'INSUFFICIENT_MATCH_FUNDS';
}

