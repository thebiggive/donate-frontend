import { HttpErrorResponse } from '@angular/common/http';
import { throwError, timer } from 'rxjs';

const excludedStatusCodes = [500];
export const getDelay = () => {
  let scalingDuration = 1_000; // ms, initial
  return (
  (error: HttpErrorResponse, retryCount: number) => {
    // if response is a status code we don't wish to retry, throw error
    if (excludedStatusCodes.includes(error.status)) {
      return throwError(() => error);
    }

    if (retryCount >= 3) {
      scalingDuration *= 2; // Double for 3rd attempt [onwards]
    }

    return timer(retryCount * scalingDuration);
  });
}
