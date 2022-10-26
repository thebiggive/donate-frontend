export default {
  title: 'Components/Content',
};

const Template = args => `
  <biggive-search
    placeholder-text="${args.placeholderText}"
    button-text="${args.buttonText}"
  </biggive-search>
  `;

document.addEventListener('doSearch', () => alert('doSearch event emitted!'));

export const SearchComponent = Template.bind({});
SearchComponent.args = {
  placeholderText: 'Search',
  buttonText: 'Search',
};
