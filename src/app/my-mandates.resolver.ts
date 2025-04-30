import { RegularGivingService } from './regularGiving.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Mandate } from './mandate.model';

export const myMandatesResolver: ResolveFn<readonly Mandate[]> = () => {
  return inject(RegularGivingService).getMyMandates();
};
