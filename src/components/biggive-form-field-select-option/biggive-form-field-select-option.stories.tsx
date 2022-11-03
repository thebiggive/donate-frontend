export default {
  title: 'Components/Forms',
  argTypes: {
    value: {
      name: 'Value',
    },
    label: {
      name: 'Label',
    },
  },
};

const Template = args => `
    <biggive-form-field-select-option
      value="${args.value}"
      label="${args.label}"
    </biggive-form-field-select-option>
    `;

document.addEventListener('doOptionSelect', () => alert('doOptionSelect event emitted!'));

export const SearchComponent = Template.bind({});
SearchComponent.args = {
  value: 'test-value',
  label: 'test label',
};
