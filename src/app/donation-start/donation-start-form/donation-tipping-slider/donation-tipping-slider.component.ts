import { AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-donation-tipping-slider',
  templateUrl: './donation-tipping-slider.component.html',
  styleUrls: ['./donation-tipping-slider.component.scss']
})
export class DonationTippingSliderComponent implements OnInit, AfterContentInit, OnDestroy {


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

  @ViewChild('handle', {static: true}) handle: ElementRef;
  @ViewChild('bar', {static: true}) bar: ElementRef;
  @ViewChild('percentageValue', {static: true}) percentageWrap: ElementRef;
  @ViewChild('donationValue', {static: true}) donationWrap: ElementRef;
  

  containerClass: string;
  donation: number;
  currencyFormatted: string;

  documentMouseupUnlistener: () => void;
  documentMousemoveUnlistener: () => void;
  documentTouchmoveUnlistener: () => void;

  isMoving = false;

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
    this.donation = Math.round(this.donationAmount * (1 / 100));
    this.currencyFormatted = this.format(this.donationCurrency, this.donation);
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

  ngOnDestroy() {
    this.documentMousemoveUnlistener();
    this.documentMouseupUnlistener();
    this.documentTouchmoveUnlistener();
  }

  format(currencyCode: 'GBP' | 'USD', amount: number) {
    return Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  }

  move = (e: MouseEvent | TouchEvent) => {
    if (this.isMoving) {
      const max = this.bar.nativeElement.offsetWidth - this.handle.nativeElement.offsetWidth;
      let pageX: number | undefined;

      if (window.TouchEvent && e instanceof TouchEvent) {
        pageX = e.touches[0]?.pageX;
      } else {
        // we Know e is a MouseEvent because all platforms that supports TouchEvent would also have
        // a truthy window.TouchEvent - see https://stackoverflow.com/a/32882849/2803757
        pageX = (e as MouseEvent).pageX;
      }

      if (pageX !== undefined) {
        const mousePos = pageX - this.bar.nativeElement.offsetLeft - this.handle.nativeElement.offsetWidth / 2;
        const position = mousePos > max ? max : mousePos < 0 ? 0 : mousePos;
        const percentage = (position / max) * this.percentageEnd >= 1 ? (position / max) * this.percentageEnd : 1;
        const donation = Math.round(this.donationAmount * (percentage / 100));

        this.percentageWrap.nativeElement.innerHTML = Math.round(percentage).toString();
        this.donationWrap.nativeElement.innerHTML = this.format(this.donationCurrency, donation);

        this.handle.nativeElement.style.marginLeft = position + 'px';
      }
    }

  }

  resetSlider = () => {
    this.handle.nativeElement.style.marginLeft = '0px';
    this.percentageWrap.nativeElement.innerHTML = '1';
    this.donationWrap.nativeElement.innerHTML = '1';
  };


  

}





