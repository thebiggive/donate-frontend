export default {
  title: 'Components/Demos',
};

const Template = args => `<biggive-search placeholder-text="${args.placeholderText}" button-text="${args.buttonText}" do-search="${args.doSearch}"></biggive-search>`;

const search = () => {
  alert('Search Button Pressed');
};

export const SearchComponent = Template.bind({});
SearchComponent.args = {
  placeholderText: 'Search',
  buttonText: 'Search',
  doSearch: search,
};
