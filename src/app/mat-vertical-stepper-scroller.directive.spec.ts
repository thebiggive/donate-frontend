import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MatVerticalStepperScrollerDirective } from './mat-vertical-stepper-scroller.directive';

class MockElementRef extends ElementRef {}

// TODO fix scroll position or drop this directive; fix test
// describe('MatVerticalStepperScrollerDirective', () => {
//   beforeEach(() => TestBed.configureTestingModule({
//       providers: [
//         { provide: ElementRef, useClass: MockElementRef },
//       ],
//     }).compileComponents(),
//   );

//   it('should create an instance', () => {
//     const directive = TestBed.createComponent(MatVerticalStepperScrollerDirective);
//     expect(directive).toBeTruthy();
//   });
// });
