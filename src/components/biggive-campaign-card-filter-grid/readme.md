# biggive-campaign-filter-grid



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute          | Description                                                                                                                                                                                                                                                                                                                                                                                    | Type                                                      | Default                       |
| -------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------- |
| `beneficiaryOptions` | --                 | JSON array of beneficiary key/values                                                                                                                                                                                                                                                                                                                                                           | `string[]`                                                | `[]`                          |
| `buttonText`         | `button-text`      | Defines the text on the search button                                                                                                                                                                                                                                                                                                                                                          | `string`                                                  | `'Search'`                    |
| `categoryOptions`    | --                 | JSON array of category key/values                                                                                                                                                                                                                                                                                                                                                              | `string[]`                                                | `[]`                          |
| `fundingOptions`     | --                 | JSON array of funding key/values                                                                                                                                                                                                                                                                                                                                                               | `string[]`                                                | `[]`                          |
| `intro`              | `intro`            | Intro                                                                                                                                                                                                                                                                                                                                                                                          | `string`                                                  | `'Find a charity or project'` |
| `locationOptions`    | --                 | JSON array of location key/values                                                                                                                                                                                                                                                                                                                                                              | `string[]`                                                | `[]`                          |
| `placeholderText`    | `placeholder-text` | Defines the text displayed as the placeholder in the input field before the user types anything                                                                                                                                                                                                                                                                                                | `string`                                                  | `'Search'`                    |
| `searchText`         | `search-text`      | Optional search text prop. Useful for pre-populating the search field when the page is loaded with a search term already existing in the URL. This can happen when sharing links, or if a donor goes to a campaign page after searching, and then returns to the search results. In such a case, the search box text will clear, unless we use this prop to populate it on rendering. DON-652. | `string`                                                  | `null`                        |
| `selectedLabel`      | `selected-label`   | This helps us inject a pre-selected dropdown value from outside of this component. This is especially helpful for the Meta campaign and Explore pages, where searching by text whipes out previous sort options and re-uses Relevance, or where one of those two pages is loaded directly with URL parameters - in such a scenario the dropdown shows that it's pre-selected. DON-558.         | `"Match funds remaining" \| "Most raised" \| "Relevance"` | `null`                        |
| `spaceBelow`         | `space-below`      | Space below component                                                                                                                                                                                                                                                                                                                                                                          | `number`                                                  | `0`                           |


## Events

| Event                     | Description                                                                                                   | Type                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doClearFilters`          | This event `doSearchAndFilterUpdate` event is emitted and propogates to the parent component which handles it | `CustomEvent<boolean>`                                                                                                                                   |
| `doSearchAndFilterUpdate` | This event `doSearchAndFilterUpdate` event is emitted and propogates to the parent component which handles it | `CustomEvent<{ searchText: string; sortBy: string; filterCategory: string; filterBeneficiary: string; filterLocation: string; filterFunding: string; }>` |


## Dependencies

### Depends on

- [biggive-button](../biggive-button)
- [biggive-form-field-select](../biggive-form-field-select)
- [biggive-form-field-select-option](../biggive-form-field-select-option)
- [biggive-popup](../biggive-popup)

### Graph
```mermaid
graph TD;
  biggive-campaign-card-filter-grid --> biggive-button
  biggive-campaign-card-filter-grid --> biggive-form-field-select
  biggive-campaign-card-filter-grid --> biggive-form-field-select-option
  biggive-campaign-card-filter-grid --> biggive-popup
  style biggive-campaign-card-filter-grid fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
