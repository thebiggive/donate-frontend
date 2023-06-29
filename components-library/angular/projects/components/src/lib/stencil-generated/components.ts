/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import type { Components } from '@biggive/components/dist/components';

import { defineCustomElement as defineBiggiveAccordion } from '@biggive/components/dist/components/biggive-accordion.js';
import { defineCustomElement as defineBiggiveAccordionEntry } from '@biggive/components/dist/components/biggive-accordion-entry.js';
import { defineCustomElement as defineBiggiveArticleCard } from '@biggive/components/dist/components/biggive-article-card.js';
import { defineCustomElement as defineBiggiveBackToTop } from '@biggive/components/dist/components/biggive-back-to-top.js';
import { defineCustomElement as defineBiggiveBasicCard } from '@biggive/components/dist/components/biggive-basic-card.js';
import { defineCustomElement as defineBiggiveBeneficiaryIcon } from '@biggive/components/dist/components/biggive-beneficiary-icon.js';
import { defineCustomElement as defineBiggiveBiographyCard } from '@biggive/components/dist/components/biggive-biography-card.js';
import { defineCustomElement as defineBiggiveBoxedContent } from '@biggive/components/dist/components/biggive-boxed-content.js';
import { defineCustomElement as defineBiggiveBrandedImage } from '@biggive/components/dist/components/biggive-branded-image.js';
import { defineCustomElement as defineBiggiveButton } from '@biggive/components/dist/components/biggive-button.js';
import { defineCustomElement as defineBiggiveCallToAction } from '@biggive/components/dist/components/biggive-call-to-action.js';
import { defineCustomElement as defineBiggiveCampaignCard } from '@biggive/components/dist/components/biggive-campaign-card.js';
import { defineCustomElement as defineBiggiveCampaignCardFilterGrid } from '@biggive/components/dist/components/biggive-campaign-card-filter-grid.js';
import { defineCustomElement as defineBiggiveCampaignHighlights } from '@biggive/components/dist/components/biggive-campaign-highlights.js';
import { defineCustomElement as defineBiggiveCarousel } from '@biggive/components/dist/components/biggive-carousel.js';
import { defineCustomElement as defineBiggiveCategoryIcon } from '@biggive/components/dist/components/biggive-category-icon.js';
import { defineCustomElement as defineBiggiveFilteredCarousel } from '@biggive/components/dist/components/biggive-filtered-carousel.js';
import { defineCustomElement as defineBiggiveFooter } from '@biggive/components/dist/components/biggive-footer.js';
import { defineCustomElement as defineBiggiveForm } from '@biggive/components/dist/components/biggive-form.js';
import { defineCustomElement as defineBiggiveFormFieldSelect } from '@biggive/components/dist/components/biggive-form-field-select.js';
import { defineCustomElement as defineBiggiveFormattedText } from '@biggive/components/dist/components/biggive-formatted-text.js';
import { defineCustomElement as defineBiggiveGenericIcon } from '@biggive/components/dist/components/biggive-generic-icon.js';
import { defineCustomElement as defineBiggiveGrid } from '@biggive/components/dist/components/biggive-grid.js';
import { defineCustomElement as defineBiggiveHeading } from '@biggive/components/dist/components/biggive-heading.js';
import { defineCustomElement as defineBiggiveHeroImage } from '@biggive/components/dist/components/biggive-hero-image.js';
import { defineCustomElement as defineBiggiveIconButton } from '@biggive/components/dist/components/biggive-icon-button.js';
import { defineCustomElement as defineBiggiveIconGroup } from '@biggive/components/dist/components/biggive-icon-group.js';
import { defineCustomElement as defineBiggiveImage } from '@biggive/components/dist/components/biggive-image.js';
import { defineCustomElement as defineBiggiveImageButton } from '@biggive/components/dist/components/biggive-image-button.js';
import { defineCustomElement as defineBiggiveImageFeature } from '@biggive/components/dist/components/biggive-image-feature.js';
import { defineCustomElement as defineBiggiveMainMenu } from '@biggive/components/dist/components/biggive-main-menu.js';
import { defineCustomElement as defineBiggiveMiscIcon } from '@biggive/components/dist/components/biggive-misc-icon.js';
import { defineCustomElement as defineBiggiveNavGroup } from '@biggive/components/dist/components/biggive-nav-group.js';
import { defineCustomElement as defineBiggiveNavItem } from '@biggive/components/dist/components/biggive-nav-item.js';
import { defineCustomElement as defineBiggivePageColumn } from '@biggive/components/dist/components/biggive-page-column.js';
import { defineCustomElement as defineBiggivePageColumns } from '@biggive/components/dist/components/biggive-page-columns.js';
import { defineCustomElement as defineBiggivePageSection } from '@biggive/components/dist/components/biggive-page-section.js';
import { defineCustomElement as defineBiggivePopup } from '@biggive/components/dist/components/biggive-popup.js';
import { defineCustomElement as defineBiggiveProgressBar } from '@biggive/components/dist/components/biggive-progress-bar.js';
import { defineCustomElement as defineBiggiveQuote } from '@biggive/components/dist/components/biggive-quote.js';
import { defineCustomElement as defineBiggiveSheet } from '@biggive/components/dist/components/biggive-sheet.js';
import { defineCustomElement as defineBiggiveSocialIcon } from '@biggive/components/dist/components/biggive-social-icon.js';
import { defineCustomElement as defineBiggiveTab } from '@biggive/components/dist/components/biggive-tab.js';
import { defineCustomElement as defineBiggiveTabbedContent } from '@biggive/components/dist/components/biggive-tabbed-content.js';
import { defineCustomElement as defineBiggiveTable } from '@biggive/components/dist/components/biggive-table.js';
import { defineCustomElement as defineBiggiveTextInput } from '@biggive/components/dist/components/biggive-text-input.js';
import { defineCustomElement as defineBiggiveTimeline } from '@biggive/components/dist/components/biggive-timeline.js';
import { defineCustomElement as defineBiggiveTimelineEntry } from '@biggive/components/dist/components/biggive-timeline-entry.js';
import { defineCustomElement as defineBiggiveTotalizer } from '@biggive/components/dist/components/biggive-totalizer.js';
import { defineCustomElement as defineBiggiveTotalizerTickerItem } from '@biggive/components/dist/components/biggive-totalizer-ticker-item.js';
import { defineCustomElement as defineBiggiveVideo } from '@biggive/components/dist/components/biggive-video.js';
import { defineCustomElement as defineBiggiveVideoFeature } from '@biggive/components/dist/components/biggive-video-feature.js';


export declare interface BiggiveAccordion extends Components.BiggiveAccordion {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveAccordion,
  inputs: ['headingColour', 'spaceBelow', 'textColour']
})
@Component({
  selector: 'biggive-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['headingColour', 'spaceBelow', 'textColour']
})
export class BiggiveAccordion {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveAccordionEntry extends Components.BiggiveAccordionEntry {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveAccordionEntry,
  inputs: ['heading']
})
@Component({
  selector: 'biggive-accordion-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['heading']
})
export class BiggiveAccordionEntry {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveArticleCard extends Components.BiggiveArticleCard {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveArticleCard,
  inputs: ['backgroundColour', 'backgroundImageUrl', 'buttonColour', 'buttonLabel', 'buttonUrl', 'clipBottomLeftCorner', 'clipTopRightCorner', 'date', 'dateColour', 'image1AltText', 'image1Url', 'image2AltText', 'image2Url', 'imageLabel', 'imageLabelColour', 'mainImageAltText', 'mainImageUrl', 'mainTitle', 'mainTitleColour', 'slug', 'slugColour', 'spaceBelow']
})
@Component({
  selector: 'biggive-article-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'backgroundImageUrl', 'buttonColour', 'buttonLabel', 'buttonUrl', 'clipBottomLeftCorner', 'clipTopRightCorner', 'date', 'dateColour', 'image1AltText', 'image1Url', 'image2AltText', 'image2Url', 'imageLabel', 'imageLabelColour', 'mainImageAltText', 'mainImageUrl', 'mainTitle', 'mainTitleColour', 'slug', 'slugColour', 'spaceBelow']
})
export class BiggiveArticleCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveBackToTop extends Components.BiggiveBackToTop {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveBackToTop
})
@Component({
  selector: 'biggive-back-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class BiggiveBackToTop {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveBasicCard extends Components.BiggiveBasicCard {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveBasicCard,
  inputs: ['addAnimation', 'backgroundColour', 'backgroundImageUrl', 'buttonAlign', 'buttonColourScheme', 'buttonLabel', 'buttonStyle', 'buttonUrl', 'cardColour', 'clipBottomLeftCorner', 'clipTopRightCorner', 'headingLevel', 'icon', 'iconColour', 'mainImageAltText', 'mainImageUrl', 'mainTitle', 'spaceBelow', 'subtitle', 'teaser', 'textColour']
})
@Component({
  selector: 'biggive-basic-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['addAnimation', 'backgroundColour', 'backgroundImageUrl', 'buttonAlign', 'buttonColourScheme', 'buttonLabel', 'buttonStyle', 'buttonUrl', 'cardColour', 'clipBottomLeftCorner', 'clipTopRightCorner', 'headingLevel', 'icon', 'iconColour', 'mainImageAltText', 'mainImageUrl', 'mainTitle', 'spaceBelow', 'subtitle', 'teaser', 'textColour']
})
export class BiggiveBasicCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveBeneficiaryIcon extends Components.BiggiveBeneficiaryIcon {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveBeneficiaryIcon,
  inputs: ['backgroundColour', 'icon', 'iconColour', 'label', 'url']
})
@Component({
  selector: 'biggive-beneficiary-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'icon', 'iconColour', 'label', 'url']
})
export class BiggiveBeneficiaryIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveBiographyCard extends Components.BiggiveBiographyCard {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveBiographyCard,
  inputs: ['backgroundColour', 'borderWidth', 'circle', 'fullName', 'imageStyle', 'imageUrl', 'jobTitle', 'ratio', 'rounded', 'spaceBelow', 'textAlign', 'textColour', 'url']
})
@Component({
  selector: 'biggive-biography-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'borderWidth', 'circle', 'fullName', 'imageStyle', 'imageUrl', 'jobTitle', 'ratio', 'rounded', 'spaceBelow', 'textAlign', 'textColour', 'url']
})
export class BiggiveBiographyCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveBoxedContent extends Components.BiggiveBoxedContent {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveBoxedContent,
  inputs: ['backgroundColour', 'horizontalPadding', 'shadow', 'spaceBelow', 'verticalPadding']
})
@Component({
  selector: 'biggive-boxed-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'horizontalPadding', 'shadow', 'spaceBelow', 'verticalPadding']
})
export class BiggiveBoxedContent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveBrandedImage extends Components.BiggiveBrandedImage {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveBrandedImage,
  inputs: ['charityLocation', 'charityName', 'charityUrl', 'imageUrl', 'logoUrl', 'slug', 'spaceBelow']
})
@Component({
  selector: 'biggive-branded-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['charityLocation', 'charityName', 'charityUrl', 'imageUrl', 'logoUrl', 'slug', 'spaceBelow']
})
export class BiggiveBrandedImage {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveButton extends Components.BiggiveButton {
  /**
   *  
   */
  doButtonClick: EventEmitter<CustomEvent<{ event: object; url: string }>>;

}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveButton,
  inputs: ['buttonId', 'centered', 'colourScheme', 'fullWidth', 'label', 'openInNewTab', 'rounded', 'size', 'spaceBelow', 'url']
})
@Component({
  selector: 'biggive-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonId', 'centered', 'colourScheme', 'fullWidth', 'label', 'openInNewTab', 'rounded', 'size', 'spaceBelow', 'url']
})
export class BiggiveButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['doButtonClick']);
  }
}


export declare interface BiggiveCallToAction extends Components.BiggiveCallToAction {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveCallToAction,
  inputs: ['defaultTextColour', 'mainTitle', 'mainTitleColour', 'mainTitleSize', 'primaryButtonColourScheme', 'primaryButtonLabel', 'primaryButtonUrl', 'secondaryButtonColourScheme', 'secondaryButtonLabel', 'secondaryButtonUrl', 'slug', 'slugColour', 'slugSize', 'spaceAbove', 'spaceBelow', 'subtitle', 'subtitleColour', 'subtitleSize', 'teaser', 'teaserColour']
})
@Component({
  selector: 'biggive-call-to-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['defaultTextColour', 'mainTitle', 'mainTitleColour', 'mainTitleSize', 'primaryButtonColourScheme', 'primaryButtonLabel', 'primaryButtonUrl', 'secondaryButtonColourScheme', 'secondaryButtonLabel', 'secondaryButtonUrl', 'slug', 'slugColour', 'slugSize', 'spaceAbove', 'spaceBelow', 'subtitle', 'subtitleColour', 'subtitleSize', 'teaser', 'teaserColour']
})
export class BiggiveCallToAction {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveCampaignCard extends Components.BiggiveCampaignCard {
  /**
   *  
   */
  doCardGeneralClick: EventEmitter<CustomEvent<{ event: object; url: string }>>;

}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveCampaignCard,
  inputs: ['banner', 'campaignTitle', 'campaignType', 'datetime', 'donateButtonColourScheme', 'donateButtonLabel', 'donateButtonUrl', 'isFutureCampaign', 'isPastCampaign', 'moreInfoButtonColourScheme', 'moreInfoButtonLabel', 'moreInfoButtonUrl', 'organisationName', 'primaryFigureAmount', 'primaryFigureLabel', 'progressBarCounter', 'secondaryFigureAmount', 'secondaryFigureLabel', 'spaceBelow']
})
@Component({
  selector: 'biggive-campaign-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['banner', 'campaignTitle', 'campaignType', 'datetime', 'donateButtonColourScheme', 'donateButtonLabel', 'donateButtonUrl', 'isFutureCampaign', 'isPastCampaign', 'moreInfoButtonColourScheme', 'moreInfoButtonLabel', 'moreInfoButtonUrl', 'organisationName', 'primaryFigureAmount', 'primaryFigureLabel', 'progressBarCounter', 'secondaryFigureAmount', 'secondaryFigureLabel', 'spaceBelow']
})
export class BiggiveCampaignCard {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['doCardGeneralClick']);
  }
}


export declare interface BiggiveCampaignCardFilterGrid extends Components.BiggiveCampaignCardFilterGrid {
  /**
   * This event `doSearchAndFilterUpdate` event is emitted and propogates to the parent
component which handles it 
   */
  doSearchAndFilterUpdate: EventEmitter<CustomEvent<{ searchText: string | null; sortBy: string | null; filterCategory: string | null; filterBeneficiary: string | null; filterLocation: string | null; filterFunding: string | null; }>>;

}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveCampaignCardFilterGrid,
  inputs: ['beneficiaryOptions', 'buttonText', 'categoryOptions', 'fundingOptions', 'intro', 'locationOptions', 'placeholderText', 'searchText', 'selectedFilterBeneficiary', 'selectedFilterCategory', 'selectedFilterFunding', 'selectedFilterLocation', 'selectedSortByOption', 'spaceBelow']
})
@Component({
  selector: 'biggive-campaign-card-filter-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['beneficiaryOptions', 'buttonText', 'categoryOptions', 'fundingOptions', 'intro', 'locationOptions', 'placeholderText', 'searchText', 'selectedFilterBeneficiary', 'selectedFilterCategory', 'selectedFilterFunding', 'selectedFilterLocation', 'selectedSortByOption', 'spaceBelow']
})
export class BiggiveCampaignCardFilterGrid {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['doSearchAndFilterUpdate']);
  }
}


export declare interface BiggiveCampaignHighlights extends Components.BiggiveCampaignHighlights {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveCampaignHighlights,
  inputs: ['banner', 'campaignTitle', 'championName', 'championUrl', 'primaryFigureAmount', 'primaryFigureLabel', 'primaryStatIcon', 'primaryStatText', 'progressBarCounter', 'secondaryFigureAmount', 'secondaryFigureLabel', 'secondaryStatIcon', 'secondaryStatText', 'spaceBelow']
})
@Component({
  selector: 'biggive-campaign-highlights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['banner', 'campaignTitle', 'championName', 'championUrl', 'primaryFigureAmount', 'primaryFigureLabel', 'primaryStatIcon', 'primaryStatText', 'progressBarCounter', 'secondaryFigureAmount', 'secondaryFigureLabel', 'secondaryStatIcon', 'secondaryStatText', 'spaceBelow']
})
export class BiggiveCampaignHighlights {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveCarousel extends Components.BiggiveCarousel {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveCarousel,
  inputs: ['buttonBackgroundColour', 'buttonIconColour', 'columnCount', 'spaceBelow'],
  methods: ['resizeToFitContent']
})
@Component({
  selector: 'biggive-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonBackgroundColour', 'buttonIconColour', 'columnCount', 'spaceBelow']
})
export class BiggiveCarousel {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveCategoryIcon extends Components.BiggiveCategoryIcon {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveCategoryIcon,
  inputs: ['backgroundColour', 'icon', 'iconColour', 'label', 'url']
})
@Component({
  selector: 'biggive-category-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'icon', 'iconColour', 'label', 'url']
})
export class BiggiveCategoryIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveFilteredCarousel extends Components.BiggiveFilteredCarousel {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveFilteredCarousel,
  inputs: ['buttonBackgroundColour', 'buttonIconColour', 'columnCount', 'spaceBelow']
})
@Component({
  selector: 'biggive-filtered-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonBackgroundColour', 'buttonIconColour', 'columnCount', 'spaceBelow']
})
export class BiggiveFilteredCarousel {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveFooter extends Components.BiggiveFooter {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveFooter,
  inputs: ['blogUrlPrefix', 'experienceUrlPrefix', 'headingLevel', 'usePresetFooter']
})
@Component({
  selector: 'biggive-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['blogUrlPrefix', 'experienceUrlPrefix', 'headingLevel', 'usePresetFooter']
})
export class BiggiveFooter {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveForm extends Components.BiggiveForm {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveForm
})
@Component({
  selector: 'biggive-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class BiggiveForm {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveFormFieldSelect extends Components.BiggiveFormFieldSelect {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveFormFieldSelect,
  inputs: ['backgroundColour', 'onSelectionChange', 'options', 'placeholder', 'prompt', 'selectStyle', 'selectedLabel', 'selectedValue', 'spaceBelow']
})
@Component({
  selector: 'biggive-form-field-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'onSelectionChange', 'options', 'placeholder', 'prompt', 'selectStyle', 'selectedLabel', 'selectedValue', 'spaceBelow']
})
export class BiggiveFormFieldSelect {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveFormattedText extends Components.BiggiveFormattedText {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveFormattedText,
  inputs: ['defaultTextColour', 'maxWidth', 'spaceBelow']
})
@Component({
  selector: 'biggive-formatted-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['defaultTextColour', 'maxWidth', 'spaceBelow']
})
export class BiggiveFormattedText {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveGenericIcon extends Components.BiggiveGenericIcon {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveGenericIcon,
  inputs: ['backgroundColour', 'icon', 'iconColour', 'iconGroup', 'url']
})
@Component({
  selector: 'biggive-generic-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'icon', 'iconColour', 'iconGroup', 'url']
})
export class BiggiveGenericIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveGrid extends Components.BiggiveGrid {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveGrid,
  inputs: ['columnCount', 'columnGap', 'spaceBelow', 'spaceBetween']
})
@Component({
  selector: 'biggive-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['columnCount', 'columnGap', 'spaceBelow', 'spaceBetween']
})
export class BiggiveGrid {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveHeading extends Components.BiggiveHeading {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveHeading,
  inputs: ['align', 'colour', 'htmlElement', 'icon', 'iconColour', 'size', 'spaceAbove', 'spaceBelow', 'text']
})
@Component({
  selector: 'biggive-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['align', 'colour', 'htmlElement', 'icon', 'iconColour', 'size', 'spaceAbove', 'spaceBelow', 'text']
})
export class BiggiveHeading {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveHeroImage extends Components.BiggiveHeroImage {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveHeroImage,
  inputs: ['buttonColourScheme', 'buttonLabel', 'buttonUrl', 'colourScheme', 'logo', 'logoAltText', 'logoHeight', 'mainImage', 'mainImageAlignHorizontal', 'mainImageAlignVertical', 'mainTitle', 'mainTitleColour', 'slug', 'slugColour', 'spaceBelow', 'teaser', 'teaserColour']
})
@Component({
  selector: 'biggive-hero-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonColourScheme', 'buttonLabel', 'buttonUrl', 'colourScheme', 'logo', 'logoAltText', 'logoHeight', 'mainImage', 'mainImageAlignHorizontal', 'mainImageAlignVertical', 'mainTitle', 'mainTitleColour', 'slug', 'slugColour', 'spaceBelow', 'teaser', 'teaserColour']
})
export class BiggiveHeroImage {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveIconButton extends Components.BiggiveIconButton {
  /**
   *  
   */
  doButtonClick: EventEmitter<CustomEvent<{ event: object; url: string }>>;

}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveIconButton,
  inputs: ['arrow', 'arrowColour', 'backgroundColour', 'backgroundPadding', 'buttonId', 'centered', 'circle', 'icon', 'iconGroup', 'openInNewTab', 'rounded', 'shadow', 'size', 'spaceBelow', 'text', 'textColour', 'url']
})
@Component({
  selector: 'biggive-icon-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['arrow', 'arrowColour', 'backgroundColour', 'backgroundPadding', 'buttonId', 'centered', 'circle', 'icon', 'iconGroup', 'openInNewTab', 'rounded', 'shadow', 'size', 'spaceBelow', 'text', 'textColour', 'url']
})
export class BiggiveIconButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['doButtonClick']);
  }
}


export declare interface BiggiveIconGroup extends Components.BiggiveIconGroup {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveIconGroup,
  inputs: ['label', 'spaceBelow']
})
@Component({
  selector: 'biggive-icon-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['label', 'spaceBelow']
})
export class BiggiveIconGroup {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveImage extends Components.BiggiveImage {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveImage,
  inputs: ['height', 'imageAltText', 'imageUrl', 'sizeUnit', 'spaceAbove', 'spaceBelow', 'width']
})
@Component({
  selector: 'biggive-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['height', 'imageAltText', 'imageUrl', 'sizeUnit', 'spaceAbove', 'spaceBelow', 'width']
})
export class BiggiveImage {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveImageButton extends Components.BiggiveImageButton {
  /**
   *  
   */
  doButtonClick: EventEmitter<CustomEvent<{ event: object; url: string }>>;

}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveImageButton,
  inputs: ['arrow', 'arrowColour', 'backgroundColour', 'backgroundPadding', 'buttonId', 'centered', 'circle', 'imageStyle', 'imageUrl', 'openInNewTab', 'rounded', 'shadow', 'size', 'spaceBelow', 'text', 'textColour', 'url']
})
@Component({
  selector: 'biggive-image-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['arrow', 'arrowColour', 'backgroundColour', 'backgroundPadding', 'buttonId', 'centered', 'circle', 'imageStyle', 'imageUrl', 'openInNewTab', 'rounded', 'shadow', 'size', 'spaceBelow', 'text', 'textColour', 'url']
})
export class BiggiveImageButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['doButtonClick']);
  }
}


export declare interface BiggiveImageFeature extends Components.BiggiveImageFeature {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveImageFeature,
  inputs: ['buttonColourScheme', 'buttonLabel', 'buttonUrl', 'defaultTextColour', 'imageAltText', 'imageUrl', 'mainTitle', 'mainTitleColour', 'slug', 'slugColour', 'spaceBelow', 'teaser', 'teaserColour']
})
@Component({
  selector: 'biggive-image-feature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonColourScheme', 'buttonLabel', 'buttonUrl', 'defaultTextColour', 'imageAltText', 'imageUrl', 'mainTitle', 'mainTitleColour', 'slug', 'slugColour', 'spaceBelow', 'teaser', 'teaserColour']
})
export class BiggiveImageFeature {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveMainMenu extends Components.BiggiveMainMenu {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveMainMenu,
  inputs: ['blogUrlPrefix', 'donateUrlPrefix', 'experienceUrlPrefix', 'isLoggedIn', 'logoUrl', 'usePresetMenuContent'],
  methods: ['closeMobileMenuFromOutside']
})
@Component({
  selector: 'biggive-main-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['blogUrlPrefix', 'donateUrlPrefix', 'experienceUrlPrefix', 'isLoggedIn', 'logoUrl', 'usePresetMenuContent']
})
export class BiggiveMainMenu {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveMiscIcon extends Components.BiggiveMiscIcon {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveMiscIcon,
  inputs: ['backgroundColour', 'icon', 'iconColour', 'url']
})
@Component({
  selector: 'biggive-misc-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'icon', 'iconColour', 'url']
})
export class BiggiveMiscIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveNavGroup extends Components.BiggiveNavGroup {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveNavGroup,
  inputs: ['inline']
})
@Component({
  selector: 'biggive-nav-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['inline']
})
export class BiggiveNavGroup {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveNavItem extends Components.BiggiveNavItem {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveNavItem,
  inputs: ['iconColour', 'label', 'url']
})
@Component({
  selector: 'biggive-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['iconColour', 'label', 'url']
})
export class BiggiveNavItem {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggivePageColumn extends Components.BiggivePageColumn {}

@ProxyCmp({
  defineCustomElementFn: defineBiggivePageColumn
})
@Component({
  selector: 'biggive-page-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class BiggivePageColumn {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggivePageColumns extends Components.BiggivePageColumns {}

@ProxyCmp({
  defineCustomElementFn: defineBiggivePageColumns,
  inputs: ['spaceBelow']
})
@Component({
  selector: 'biggive-page-columns',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['spaceBelow']
})
export class BiggivePageColumns {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggivePageSection extends Components.BiggivePageSection {}

@ProxyCmp({
  defineCustomElementFn: defineBiggivePageSection,
  inputs: ['colourScheme', 'maxWidth', 'primaryFullBleed', 'sectionStyleBottom', 'sectionStyleTop', 'spaceBelow']
})
@Component({
  selector: 'biggive-page-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['colourScheme', 'maxWidth', 'primaryFullBleed', 'sectionStyleBottom', 'sectionStyleTop', 'spaceBelow']
})
export class BiggivePageSection {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggivePopup extends Components.BiggivePopup {}

@ProxyCmp({
  defineCustomElementFn: defineBiggivePopup,
  methods: ['openFromOutside', 'closeFromOutside']
})
@Component({
  selector: 'biggive-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class BiggivePopup {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveProgressBar extends Components.BiggiveProgressBar {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveProgressBar,
  inputs: ['colourScheme', 'counter', 'spaceBelow']
})
@Component({
  selector: 'biggive-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['colourScheme', 'counter', 'spaceBelow']
})
export class BiggiveProgressBar {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveQuote extends Components.BiggiveQuote {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveQuote,
  inputs: ['attribution', 'defaultTextColour', 'quote', 'quoteIconColour', 'spaceBelow']
})
@Component({
  selector: 'biggive-quote',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['attribution', 'defaultTextColour', 'quote', 'quoteIconColour', 'spaceBelow']
})
export class BiggiveQuote {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveSheet extends Components.BiggiveSheet {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveSheet,
  inputs: ['backgroundColour', 'sheetId', 'textColour']
})
@Component({
  selector: 'biggive-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'sheetId', 'textColour']
})
export class BiggiveSheet {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveSocialIcon extends Components.BiggiveSocialIcon {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveSocialIcon,
  inputs: ['backgroundColour', 'iconColour', 'labelPrefix', 'service', 'url', 'wide']
})
@Component({
  selector: 'biggive-social-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['backgroundColour', 'iconColour', 'labelPrefix', 'service', 'url', 'wide']
})
export class BiggiveSocialIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveTab extends Components.BiggiveTab {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveTab,
  inputs: ['tabTitle']
})
@Component({
  selector: 'biggive-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['tabTitle']
})
export class BiggiveTab {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveTabbedContent extends Components.BiggiveTabbedContent {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveTabbedContent,
  inputs: ['buttonBackgroundColour', 'buttonIconColour', 'navigationHighlightColour', 'selectedNavigationHighlightColour', 'selectedTextColour', 'spaceBelow', 'textColour']
})
@Component({
  selector: 'biggive-tabbed-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonBackgroundColour', 'buttonIconColour', 'navigationHighlightColour', 'selectedNavigationHighlightColour', 'selectedTextColour', 'spaceBelow', 'textColour']
})
export class BiggiveTabbedContent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveTable extends Components.BiggiveTable {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveTable,
  inputs: ['bodyBackgroundColour', 'bodyTextColour', 'headerBackgroundColour', 'headerTextColour', 'spaceBelow']
})
@Component({
  selector: 'biggive-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['bodyBackgroundColour', 'bodyTextColour', 'headerBackgroundColour', 'headerTextColour', 'spaceBelow']
})
export class BiggiveTable {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveTextInput extends Components.BiggiveTextInput {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveTextInput,
  inputs: ['currency', 'prompt', 'selectStyle', 'spaceBelow', 'value']
})
@Component({
  selector: 'biggive-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['currency', 'prompt', 'selectStyle', 'spaceBelow', 'value']
})
export class BiggiveTextInput {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveTimeline extends Components.BiggiveTimeline {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveTimeline,
  inputs: ['buttonBackgroundColour', 'buttonIconColour', 'entryBackgroundColour', 'entryDateColour', 'entryHighlightColour', 'entryTextColour', 'entryTitleColour', 'navigationHighlightColour', 'selectedNavigationHighlightColour', 'selectedTextColour', 'spaceBelow', 'textColour']
})
@Component({
  selector: 'biggive-timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonBackgroundColour', 'buttonIconColour', 'entryBackgroundColour', 'entryDateColour', 'entryHighlightColour', 'entryTextColour', 'entryTitleColour', 'navigationHighlightColour', 'selectedNavigationHighlightColour', 'selectedTextColour', 'spaceBelow', 'textColour']
})
export class BiggiveTimeline {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveTimelineEntry extends Components.BiggiveTimelineEntry {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveTimelineEntry,
  inputs: ['date', 'heading']
})
@Component({
  selector: 'biggive-timeline-entry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['date', 'heading']
})
export class BiggiveTimelineEntry {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveTotalizer extends Components.BiggiveTotalizer {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveTotalizer,
  inputs: ['mainMessage', 'primaryColour', 'primaryTextColour', 'secondaryColour', 'secondaryTextColour', 'spaceBelow']
})
@Component({
  selector: 'biggive-totalizer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['mainMessage', 'primaryColour', 'primaryTextColour', 'secondaryColour', 'secondaryTextColour', 'spaceBelow']
})
export class BiggiveTotalizer {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveTotalizerTickerItem extends Components.BiggiveTotalizerTickerItem {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveTotalizerTickerItem,
  inputs: ['figure', 'label']
})
@Component({
  selector: 'biggive-totalizer-ticker-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['figure', 'label']
})
export class BiggiveTotalizerTickerItem {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveVideo extends Components.BiggiveVideo {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveVideo,
  inputs: ['spaceAbove', 'spaceBelow', 'videoUrl']
})
@Component({
  selector: 'biggive-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['spaceAbove', 'spaceBelow', 'videoUrl']
})
export class BiggiveVideo {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface BiggiveVideoFeature extends Components.BiggiveVideoFeature {}

@ProxyCmp({
  defineCustomElementFn: defineBiggiveVideoFeature,
  inputs: ['buttonColourScheme', 'buttonLabel', 'buttonUrl', 'defaultTextColour', 'mainTitle', 'mainTitleColour', 'slug', 'slugColour', 'spaceAbove', 'spaceBelow', 'teaser', 'teaserColour', 'videoUrl']
})
@Component({
  selector: 'biggive-video-feature',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonColourScheme', 'buttonLabel', 'buttonUrl', 'defaultTextColour', 'mainTitle', 'mainTitleColour', 'slug', 'slugColour', 'spaceAbove', 'spaceBelow', 'teaser', 'teaserColour', 'videoUrl']
})
export class BiggiveVideoFeature {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
