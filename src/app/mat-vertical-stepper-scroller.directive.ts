import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Loosely adapted from https://github.com/angular/components/issues/8881#issuecomment-487804543
 * and the preceding comments.
 *
 * In our case, with few steps and a fixed header, scrolling to the top of
 * the whole stepper seems like the best option for keeping things clear
 * and maintaining the previous steps' context.
 */
@Directive({
  selector: '[appMatVerticalStepperScroller]',
})
export class MatVerticalStepperScrollerDirective {
  constructor(private stepper: ElementRef) {
    console.log('Init!');
  }

  @HostListener('selectionChange', ['$event'])
  selectionChanged() {
    console.log('Changed!');

    setTimeout(() => {
      this.stepper.nativeElement. scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }, 250);
  }
}
