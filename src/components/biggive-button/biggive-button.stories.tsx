export default {
  title: 'Components/Buttons',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    colourScheme: {
      name: 'Colour scheme',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    isPastCampaign: {
      name: 'Is Past Campaign',
      options: [true, false],
    },
    isFutureCampaign: {
      name: 'Is Future Campaign',
      options: [true, false],
    },
    datetime: {
      name: 'Date Time',
    },
    label: {
      name: 'Label',
    },
    url: {
      name: 'Url',
    },
    openInNewTab: {
      name: 'Open in new tab',
    },
    fullWidth: {
      name: 'Full width',
    },
    size: {
      name: 'Size',
      control: {
        type: 'select',
        options: ['small', 'medium'],
      },
    },
    rounded: {
      name: 'Rounded',
    },
    centered: {
      name: 'Centered',
    },
  },
};

const Template = args => `
    <biggive-button
      space-below="${args.spaceBelow}"
      colour-scheme="${args.colourScheme}"
      is-past-campaign="${args.isPastCampaign}"
      is-future-campaign="${args.isFutureCampaign}"
      datetime="${args.datetime}"
      label="${args.label}"
      url="${args.url}"
      open-in-new-tab="${args.openInNewTab}"
      full-width=${args.fullWidth}
      size=${args.size}
      rounded=${args.rounded}
      centered=${args.centered}
    </biggive-button>
    `;

export const ButtonComponent = Template.bind({});
ButtonComponent.args = {
  spaceBelow: 0,
  colourScheme: 'primary',
  isPastCampaign: false,
  isFutureCampaign: false,
  datetime: '29/11/2022, 12:00',
  label: 'Donate now',
  url: 'http://www.google.com',
  openInNewTab: false,
  fullWidth: false,
  size: 'medium',
  rounded: false,
  centered: false,
};
