// Stops events from a given element propagating to and being consumed by leaflet.
// On Firefox Android, the native <select> picker operates at the browser UI level,
// above the DOM event chain, so blocking DOM pointer events is insufficient.
// The fix disables pointer events on the parent Leaflet map container when the
// select dropdown is open, but only on touch devices — on desktop, a focused select
// is not necessarily open, so the map should remain clickable.
//
// The approach: on touch devices, when the user taps the biggive-form-field-select
// web component host to open the native picker, we disable pointer events on the
// Leaflet container. When the selection changes (detected via the change event,
// which crosses Shadow DOM), we restore pointer events.

import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';

@Directive({
  selector: '[appStopMapPropagation]',
  standalone: true,
})
export class StopMapPropagationDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Reference to the parent Leaflet container so we can toggle pointer events
  private leafletContainer: HTMLElement | null = null;

  // Whether this device uses touch input (where tapping opens the native picker)
  private isTouchDevice = false;

  // Whether the dropdown is currently open (to track state)
  private isDropdownOpen = false;

  // Stored listener references for cleanup in ngOnDestroy
  private onPointerDown: ((e: PointerEvent) => void) | null = null;
  private onChange: (() => void) | null = null;
  private onFocusOut: (() => void) | null = null;

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    const host = this.el.nativeElement;

    // Find the parent Leaflet container (the .campaign-map div that Leaflet
    // adds .leaflet-container class to). We need to disable pointer events on
    // it when the select dropdown is open on touch devices.
    this.leafletContainer = host.closest('.leaflet-container');

    // Detect touch device via matchMedia (more reliable than navigator.maxTouchPoints
    // which can be true on hybrid devices with both touch and mouse)
    this.isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // Override Leaflet's touch-action on the map container.
    // Leaflet sets touch-action: pinch-zoom (or none) on .leaflet-container,
    // which cascades to children. On Firefox Android, this causes the browser
    // to treat taps as potential gestures.
    // "manipulation" allows scrolling but disables pinch-zoom.
    host.style.touchAction = 'manipulation';

    // Also apply to any child web components (the dropdown is a custom element
    // with Shadow DOM — the style won't penetrate, but the host element itself
    // needs it too for Firefox Android)
    const children = host.querySelectorAll('biggive-form-field-select');
    children.forEach((child: HTMLElement) => {
      child.style.touchAction = 'manipulation';
    });

    // On touch devices, when the user taps the biggive-form-field-select to
    // open the native picker, disable pointer events on the Leaflet container.
    // When the selection changes, restore pointer events.
    //
    // On desktop, the map should remain clickable at all times — the existing
    // L.DomEvent.disableClickPropagation below handles desktop propagation.
    //
    // We use pointerdown (not click) because it fires before the native picker
    // opens, giving us a chance to disable pointer events on the map before
    // the browser renders the picker UI.
    //
    // We use the change event to detect when the selection is complete.
    // The change event crosses Shadow DOM boundaries (composed: true).
    this.zone.runOutsideAngular(() => {
      this.onPointerDown = (e: PointerEvent) => {
        if (!this.isTouchDevice) return;

        const target = e.target as HTMLElement;
        // Check if the tap is on or inside the biggive-form-field-select
        // The target may be the host element or a child (due to Shadow DOM retargeting)
        if (target.tagName === 'BIGGIVE-FORM-FIELD-SELECT' && host.contains(target)) {
          // Mark the dropdown as open and disable pointer events on the map
          this.isDropdownOpen = true;
          if (this.leafletContainer) {
            this.leafletContainer.style.pointerEvents = 'none';
          }
        }
      };

      this.onChange = () => {
        if (!this.isTouchDevice) return;

        // When the selection changes, the native picker should close.
        // Restore pointer events on the map.
        if (this.isDropdownOpen) {
          this.isDropdownOpen = false;
          if (this.leafletContainer) {
            this.leafletContainer.style.pointerEvents = 'auto';
          }
        }
      };

      // Fallback: if the user dismisses the dropdown without selecting,
      // the change event won't fire. Focusout (which crosses Shadow DOM)
      // will fire when the select loses focus, so we restore pointer events.
      this.onFocusOut = () => {
        if (!this.isTouchDevice) return;

        if (this.isDropdownOpen) {
          this.isDropdownOpen = false;
          if (this.leafletContainer) {
            this.leafletContainer.style.pointerEvents = 'auto';
          }
        }
      };

      // Listen in capture phase to intercept before Leaflet
      host.addEventListener('pointerdown', this.onPointerDown, true);
      // Change event bubbles and crosses Shadow DOM
      host.addEventListener('change', this.onChange, false);
      // Focusout crosses Shadow DOM boundaries (composed: true)
      host.addEventListener('focusout', this.onFocusOut, false);
    });

    // Load Leaflet only in the browser (it references window on import)
    const L = await import('leaflet');
    L.DomEvent.disableClickPropagation(host);
    L.DomEvent.disableScrollPropagation(host);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    const host = this.el.nativeElement;

    // Remove listeners
    if (this.onPointerDown) {
      host.removeEventListener('pointerdown', this.onPointerDown, true);
    }
    if (this.onChange) {
      host.removeEventListener('change', this.onChange);
    }
    if (this.onFocusOut) {
      host.removeEventListener('focusout', this.onFocusOut);
    }

    // Restore pointer events on the Leaflet container if we disabled them
    if (this.leafletContainer) {
      this.leafletContainer.style.pointerEvents = 'auto';
    }
  }
}
