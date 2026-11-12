// Stops events from a given element propagating to and being consumed by leaflet.
// On Firefox Android, the native <select> picker operates at the browser UI level,
// above the DOM event chain, so blocking DOM pointer events is insufficient.
// The fix disables pointer events on the parent Leaflet map container when the
// select is focused, but only on touch devices — on desktop, a focused select
// is not necessarily open, so the map should remain clickable.

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

  // Whether this device uses touch input (where focus opens the native picker)
  private isTouchDevice = false;

  // Stored listener references for cleanup in ngOnDestroy
  private onFocusIn: ((e: FocusEvent) => void) | null = null;
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

    // On touch devices (mobile), when the select inside the
    // biggive-form-field-select web component receives focus, the native
    // picker opens immediately. Disable pointer events on the entire Leaflet
    // map container to prevent Leaflet from intercepting pointer events while
    // the browser's native select picker is open.
    //
    // On desktop, a focused select is not necessarily open (user may have
    // tabbed to it), so we do NOT disable pointer events — the map should
    // remain clickable. The existing L.DomEvent.disableClickPropagation
    // below handles desktop propagation correctly.
    //
    // Note: 'focus' and 'blur' do NOT cross Shadow DOM boundaries, but
    // 'focusin' and 'focusout' DO bubble across shadow boundaries. We use
    // focusin/focusout on the host container to detect when the internal
    // <select> inside the web component's Shadow DOM gains/loses focus.
    //
    // When focusin fires, the target is retargeted to the shadow host
    // (biggive-form-field-select), so we check if the retargeted element
    // is a child of our host container.
    this.zone.runOutsideAngular(() => {
      this.onFocusIn = (e: FocusEvent) => {
        if (!this.isTouchDevice) return;

        const target = e.target as HTMLElement;
        // The retargeted target will be the web component host element.
        // If it's a biggive-form-field-select inside our container, disable
        // pointer events on the Leaflet map.
        if (target.tagName === 'BIGGIVE-FORM-FIELD-SELECT' && host.contains(target)) {
          if (this.leafletContainer) {
            this.leafletContainer.style.pointerEvents = 'none';
          }
        }
      };

      this.onFocusOut = () => {
        if (this.leafletContainer) {
          this.leafletContainer.style.pointerEvents = 'auto';
        }
      };

      // Listen in capture phase so we catch the event before it reaches Leaflet
      host.addEventListener('focusin', this.onFocusIn, true);
      host.addEventListener('focusout', this.onFocusOut, true);
    });

    // Load Leaflet only in the browser (it references window on import)
    const L = await import('leaflet');
    L.DomEvent.disableClickPropagation(host);
    L.DomEvent.disableScrollPropagation(host);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    const host = this.el.nativeElement;

    // Remove focus listeners
    if (this.onFocusIn) {
      host.removeEventListener('focusin', this.onFocusIn, true);
    }
    if (this.onFocusOut) {
      host.removeEventListener('focusout', this.onFocusOut, true);
    }

    // Restore pointer events on the Leaflet container if we disabled them
    if (this.leafletContainer) {
      this.leafletContainer.style.pointerEvents = 'auto';
    }
  }
}
