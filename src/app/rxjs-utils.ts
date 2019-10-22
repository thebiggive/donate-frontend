import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { timer } from 'rxjs/observable/timer';
import { finalize, switchMap, combineLatest } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject'

// Class based on this example: https://www.learnrxjs.io/operators/error_handling/retrywhen.html

export const genericRetryStrategy = (
  {
    maxRetryAttempts = 4,
    scalingDuration = 1000,
    excludedStatusCodes = [],
    retry = new Subject<any>(),
  }: {
    maxRetryAttempts?: number;
    scalingDuration?: number;
    excludedStatusCodes?: number[];
    retry?: any;
  } = {},
) => (attempts: Observable<any>) => {
  return attempts.pipe(
    switchMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return _throw(error);
      }
      // retry after 1s, 2s, 6s and 8s
      if (retryAttempt === 3 || retryAttempt === 4) {
        scalingDuration = 2000;
      }
      console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => console.log('Abandoning donation as server took too long to respond')),
  );
};
