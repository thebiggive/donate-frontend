export default {
  title: 'Components/Forms',
};

const Template = () => `
      <biggive-form-field-select>
      </biggive-form-field-select>
      `;

document.addEventListener('doOptionSelect', () => alert('doOptionSelect event emitted!'));

export const SearchComponent = Template.bind({});
