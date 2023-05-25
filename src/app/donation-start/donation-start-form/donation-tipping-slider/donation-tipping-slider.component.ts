import { AfterContentInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-donation-tipping-slider',
  templateUrl: './donation-tipping-slider.component.html',
  styleUrls: ['./donation-tipping-slider.component.scss']
})
export class DonationTippingSliderComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {


  @Input() spaceBelow: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

  @Input() colourScheme:
  | 'primary' // blue
  | 'secondary' // green
  | 'tertiary' // coral
  | 'brand-1' // cc-red
  | 'brand-2' // wgmf-purple
  | 'brand-3' // gmf-green
  | 'brand-4' // emf-yellow
  | 'brand-5' // c4c-orange
  | 'brand-6' // mhf-turquoise
  | 'white'
  | 'black'
  | 'grey-extra-light'
  | 'grey-light'
  | 'grey-medium'
  | 'grey-dark' = 'primary';

  @Input() percentageCurrent: number;
  @Input() percentageStart: number;
  @Input() percentageEnd: number;
  @Input() donationAmount: number;
  //ISO-4217 currency code (e.g. GBP, USD)
  @Input() donationCurrency!: 'GBP' | 'USD';
  @Input() onHandleMoved: (tipPercentage: number, tipAmount: number) => void;

  @ViewChild('handle', {static: true}) handle: ElementRef;
  @ViewChild('bar', {static: true}) bar: ElementRef;
  @ViewChild('percentageValue', {static: true}) percentageWrap: ElementRef;
  @ViewChild('donationValue', {static: true}) donationWrap: ElementRef;


  containerClass: string;
  derivedPercentage: number;
  tipAmount: number;
  currencyFormatted: string;

  documentMouseupUnlistener: () => void;
  documentMousemoveUnlistener: () => void;
  documentTouchmoveUnlistener: () => void;

  isMoving = false;
  max: number;
  pageX: any;
  mousePos: number;
  position: number;
  disableDefaults: boolean = false;

  constructor(
    public renderer: Renderer2
  ) {
    this.documentMouseupUnlistener = renderer.listen('document', 'mouseup', () => {
      this.isMoving = false;
    });

    this.documentMousemoveUnlistener = renderer.listen('document', 'mousemove', (event: MouseEvent | TouchEvent) => {
      this.move(event);
    });

    this.documentTouchmoveUnlistener = renderer.listen('document', 'touchmove', (event: MouseEvent | TouchEvent) => {
      this.move(event);
    });
  };


  ngOnInit() {
    this.containerClass = 'container space-below-' + this.spaceBelow;
    this.calcAndSetPercentage();
    this.adjustDonationPercentageAndValue();
    this.updateHandlePosition(undefined)
  }

  ngAfterContentInit() {
    if (this.bar) {
      this.bar.nativeElement.addEventListener('mousedown',  (e: MouseEvent | TouchEvent) => {
        this.isMoving = true;
        this.move(e);
      });

      this.bar.nativeElement.addEventListener('touchstart', (e: MouseEvent | TouchEvent) => {
        this.isMoving = true;
        this.move(e);
      });

      this.bar.nativeElement.addEventListener('touchend', () => {
        this.isMoving = false;
      });
    }
  };

  // detect changes in the donationAmount input
  ngOnChanges(changed: any) {
    this.max = this.bar.nativeElement.offsetWidth - this.handle.nativeElement.offsetWidth;
    if (changed.donationAmount.currentValue != changed.donationAmount.previousValue) {
      this.calcAndSetPercentage();
      this.calcAndSetTipAmount();
      this.adjustDonationPercentageAndValue();
      this.updateHandlePosition(undefined);
      this.onHandleMoved(this.derivedPercentage, this.tipAmount);
    }
  }

  ngOnDestroy() {
    this.documentMousemoveUnlistener();
    this.documentMouseupUnlistener();
    this.documentTouchmoveUnlistener();
  }

  calcAndSetPercentage() {
  // the calculation results from mouse click
   if (this.isMoving) {
    this.derivedPercentage = Math.round((this.position / this.max) * this.percentageEnd >= 1 ? (this.position / this.max) * this.percentageEnd : 1);
   }
  // the calculation results from input changes
   else if (!this.disableDefaults){
      if (!this.donationAmount) {
        this.derivedPercentage = 0;
      }
      if (this.donationAmount >= 1000) {
        this.derivedPercentage = 7.5;
      } else if (this.donationAmount >= 300) {
        this.derivedPercentage = 10;
      } else if (this.donationAmount >= 100) {
        this.derivedPercentage = 12.5;
      } else {
        this.derivedPercentage = 15;
      }
    }
  }

  format(currencyCode: 'GBP' | 'USD', amount: number) {
    return Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  }

  move = (e: MouseEvent | TouchEvent) => {
    if (this.isMoving) {
      this.disableDefaults = true;
      this.max = this.bar.nativeElement.offsetWidth - this.handle.nativeElement.offsetWidth;

      if (window.TouchEvent && e instanceof TouchEvent) {
        this.pageX = e.touches[0]?.pageX;
      } else {
        // we Know e is a MouseEvent because all platforms that supports TouchEvent would also have
        // a truthy window.TouchEvent - see https://stackoverflow.com/a/32882849/2803757
        this.pageX = (e as MouseEvent).pageX;
      }

      if (this.pageX !== undefined) {
        if(this.derivedPercentage) {
          this.calcAndSetTipAmount();
          this.updateHandlePosition(e);
          this.adjustDonationPercentageAndValue();
          this.onHandleMoved(this.derivedPercentage, this.tipAmount);
        }
      }
    }

  }

  calcAndSetTipAmount() {
    if (this.donationAmount < 55) {
      this.tipAmount = this.donationAmount * (this.derivedPercentage / 100);
    } else {
      this.tipAmount = Math.round(this.donationAmount * (this.derivedPercentage / 100));
    }
  }

  updateHandlePosition(e: MouseEvent | TouchEvent | undefined) {
    if(!e) { // the handle position is driven by the donation input change
      this.calcAndSetPercentage();
      this.pageX = 122;
      this.mousePos = this.pageX - this.bar.nativeElement.offsetLeft - this.handle.nativeElement.offsetWidth / 2;
      this.position = this.max * this.derivedPercentage / this.percentageEnd;
      this.handle.nativeElement.style.marginLeft = this.position + 'px';
    } else { // the handle position is driven by the mouse click on slider
      this.mousePos = this.pageX - this.bar.nativeElement.offsetLeft - this.handle.nativeElement.offsetWidth / 2;
      this.position = this.mousePos > this.max ? this.max : this.mousePos < 0 ? 0 : this.mousePos;
      this.calcAndSetPercentage();
    }

    this.handle.nativeElement.style.marginLeft = this.position + 'px';
  }

  adjustDonationPercentageAndValue() {
    this.percentageWrap.nativeElement.innerHTML = this.derivedPercentage.toString();
    this.currencyFormatted = this.format(this.donationCurrency, this.tipAmount);
    this.donationWrap.nativeElement.innerHTML = this.currencyFormatted;
  }

  resetSlider = () => {
    this.handle.nativeElement.style.marginLeft = '0px';
    this.percentageWrap.nativeElement.innerHTML = '1';
    this.donationWrap.nativeElement.innerHTML = '1';
  };
}





