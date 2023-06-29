# biggive-hero-image

Provides a large format image-based header feature, typically used at the top of a page. Features an image, title, plus teaser text

<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                     | Description                                                    | Type                                                                                                                                                                                                                            | Default     |
| -------------------------- | ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `buttonColourScheme`       | `button-colour-scheme`        | Button Colour Scheme                                           | `"black" \| "brand-1" \| "brand-2" \| "brand-3" \| "brand-4" \| "brand-5" \| "brand-6" \| "grey-dark" \| "grey-extra-light" \| "grey-light" \| "grey-medium" \| "primary" \| "secondary" \| "tertiary" \| "white"`              | `'primary'` |
| `buttonLabel`              | `button-label`                | Button Label                                                   | `string`                                                                                                                                                                                                                        | `undefined` |
| `buttonUrl`                | `button-url`                  | Button Url                                                     | `string`                                                                                                                                                                                                                        | `undefined` |
| `colourScheme`             | `colour-scheme`               | Colour Scheme                                                  | `"black" \| "brand-1" \| "brand-2" \| "brand-3" \| "brand-4" \| "brand-5" \| "brand-6" \| "grey-dark" \| "grey-extra-light" \| "grey-light" \| "grey-medium" \| "primary" \| "secondary" \| "tertiary" \| "white"`              | `'primary'` |
| `logo`                     | `logo`                        | Full URL of a logo image.                                      | `string`                                                                                                                                                                                                                        | `''`        |
| `logoAltText`              | `logo-alt-text`               | Logo alt text                                                  | `string`                                                                                                                                                                                                                        | `''`        |
| `logoHeight`               | `logo-height`                 | Logo container height selection. Numbers are not measurements. | `1 \| 10 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9`                                                                                                                                                                               | `3`         |
| `mainImage`                | `main-image`                  | Full URL of a main hero image.                                 | `null \| string`                                                                                                                                                                                                                | `null`      |
| `mainImageAlignHorizontal` | `main-image-align-horizontal` | Horizontal alignment of image                                  | `string`                                                                                                                                                                                                                        | `'center'`  |
| `mainImageAlignVertical`   | `main-image-align-vertical`   | Vertical alignment of image                                    | `string`                                                                                                                                                                                                                        | `'center'`  |
| `mainTitle`                | `main-title`                  | Hero image title, typically the page.                          | `string`                                                                                                                                                                                                                        | `undefined` |
| `mainTitleColour`          | `main-title-colour`           | Main title colour                                              | `"black" \| "brand-1" \| "brand-2" \| "brand-3" \| "brand-4" \| "brand-5" \| "brand-6" \| "grey-dark" \| "grey-extra-light" \| "grey-light" \| "grey-medium" \| "primary" \| "secondary" \| "tertiary" \| "white" \| undefined` | `undefined` |
| `slug`                     | `slug`                        | Header slug                                                    | `string`                                                                                                                                                                                                                        | `undefined` |
| `slugColour`               | `slug-colour`                 | Header slug colour                                             | `"black" \| "brand-1" \| "brand-2" \| "brand-3" \| "brand-4" \| "brand-5" \| "brand-6" \| "grey-dark" \| "grey-extra-light" \| "grey-light" \| "grey-medium" \| "primary" \| "secondary" \| "tertiary" \| "white"`              | `undefined` |
| `spaceBelow`               | `space-below`                 | Space below component                                          | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                                                                                                                                                                                               | `0`         |
| `teaser`                   | `teaser`                      | Introductory teaser text                                       | `string`                                                                                                                                                                                                                        | `undefined` |
| `teaserColour`             | `teaser-colour`               | Teaser colour                                                  | `"black" \| "brand-1" \| "brand-2" \| "brand-3" \| "brand-4" \| "brand-5" \| "brand-6" \| "grey-dark" \| "grey-extra-light" \| "grey-light" \| "grey-medium" \| "primary" \| "secondary" \| "tertiary" \| "white" \| undefined` | `undefined` |


## Dependencies

### Depends on

- [biggive-button](../biggive-button)

### Graph
```mermaid
graph TD;
  biggive-hero-image --> biggive-button
  style biggive-hero-image fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
