export default {
  title: 'Components/Demos',
};

const Template = (args) => `<biggive-search placeholderText="${args.placeholderText}" buttonText="${args.buttonText}" doSearch="${args.doSearch}"></biggive-search>`;

const search = () => {
  alert('Search Button Pressed');
};


export const SearchComponent = Template.bind({});
SearchComponent.args = {
  placeholderText: 'Search',
  buttonText: 'Search',
  doSearch: search
};
