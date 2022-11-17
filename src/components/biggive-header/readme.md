# biggive-header



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                     | Description                                                                                                                                                                                                                                                                                                                                                                                                              | Type      | Default |
| -------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------- |
| `logoUrl`                  | `logo-url`                    | Logo hyperlink URL                                                                                                                                                                                                                                                                                                                                                                                                       | `string`  | `'/'`   |
| `showCompressedMobileMenu` | `show-compressed-mobile-menu` | Currently, it's quite tricky to get the nav to close when clicking on a slotted native `li` tag without making custom biggive-li tags which emit events that get listened to in this header and then toggle the mobile menu on and off. As time is tight, let's just pass a prop that gets toggled on nav item clicks detected in Angular. This way, Angular is in charge of passing the prop to toggle the mobile menu. | `boolean` | `true`  |
| `spaceBelow`               | `space-below`                 | Space below component                                                                                                                                                                                                                                                                                                                                                                                                    | `number`  | `0`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
