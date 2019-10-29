import { Observable, throwError, timer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

// Based on example 2 from https://www.learnrxjs.io/operators/error_handling/retrywhen.html
export const retryStrategy = (
  {
    maxRetryAttempts = 4,
    scalingDuration = 1000,
    excludedStatusCodes = [],
  }: {
    maxRetryAttempts?: number;
    scalingDuration?: number;
    excludedStatusCodes?: number[];
  } = {},
) => (attempts: Observable<any>) => {
  return attempts.pipe(
    switchMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return throwError (error);
      }
      // retry after 1s, 2s, 6s and 8s
      if (retryAttempt === 3 || retryAttempt === 4) {
        scalingDuration = 2000;
      }
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => {}),
  );
};
