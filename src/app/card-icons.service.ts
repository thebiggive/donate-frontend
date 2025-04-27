import { Injectable } from '@angular/core';
import { IconDefinition } from '@fortawesome/angular-fontawesome';
import {
  faCcAmex,
  faCcDinersClub,
  faCcDiscover,
  faCcJcb,
  faCcMastercard,
  faCcVisa,
} from '@fortawesome/free-brands-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class CardIconsService {
  getCardIcon(brand?: string): IconDefinition {
    switch (brand) {
      case 'amex':
        return faCcAmex;
      case 'diners':
        return faCcDinersClub;
      case 'discover':
        return faCcDiscover;
      case 'jcb':
        return faCcJcb;
      case 'mastercard':
        return faCcMastercard;
      case 'visa':
        return faCcVisa;
      default:
        throw new Error(`Unknown card brand: ${brand}`);
    }
  }

  hasCardIcon(brand?: string): boolean {
    try {
      this.getCardIcon(brand);
      return true;
    } catch (_e) {
      return false;
    }
  }
}
