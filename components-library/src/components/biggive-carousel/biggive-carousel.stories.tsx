export default {
  title: 'Components/Layout',
  argTypes: {
    spaceBelow: {
      name: 'Space below',
      control: {
        type: 'select',
        options: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    columnCount: {
      name: 'Column Count',
      control: {
        type: 'select',
        options: [1, 2, 3, 4],
      },
    },
    buttonBackgroundColour: {
      name: 'Button background colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
    buttonIconColour: {
      name: 'Button icon colour',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'tertiary', 'brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6', 'white', 'black'],
      },
    },
  },
};

const Template = args => `
                  <biggive-tabbed-content
                    space-below="${args.spaceBelow}"  
                    column-count="${args.columnCount}"
                    button-background-colour="${args.buttonBackgroundColour}"
                    button-icon-colour="${args.buttonIconColour}"
                    >
                    <biggive-quote
                    space-below="0"
                    default-text-colour="primary"
                    quote="1 Lorem ipsum dolor sit amet, has quod diam dolore cu, at solet interesset eam, cu nec affert quando legendos. Ut libris aperiam quo. Et tollit intellegebat mea. Dico nostrud vivendum no his, nam ne sumo illum iudicabit. Cu nec velit argumentum, no quando offendit neglegentur ius.  "
                    attribution="this is the attribution"
                    >
                    </biggive-quote>
                    <biggive-quote
                    space-below="0"
                    default-text-colour="secondary"
                    quote="2 Lorem ipsum dolor sit amet, has quod diam dolore cu, at solet interesset eam, cu nec affert quando legendos. Ut libris aperiam quo. Et tollit intellegebat mea. Dico nostrud vivendum no his, nam ne sumo illum iudicabit. Cu nec velit argumentum, no quando offendit neglegentur ius.  "
                    attribution="this is the attribution"
                    >
                    </biggive-quote>
                    <biggive-quote
                    space-below="0"
                    default-text-colour="tertiary"
                    quote="3 Lorem ipsum dolor sit amet, has quod diam dolore cu, at solet interesset eam, cu nec affert quando legendos. Ut libris aperiam quo. Et tollit intellegebat mea. Dico nostrud vivendum no his, nam ne sumo illum iudicabit. Cu nec velit argumentum, no quando offendit neglegentur ius.  "
                    attribution="this is the attribution"
                    >
                    </biggive-quote>
                    <biggive-quote
                    space-below="0"
                    default-text-colour="brand-1"
                    quote="4 Lorem ipsum dolor sit amet, has quod diam dolore cu, at solet interesset eam, cu nec affert quando legendos. Ut libris aperiam quo. Et tollit intellegebat mea. Dico nostrud vivendum no his, nam ne sumo illum iudicabit. Cu nec velit argumentum, no quando offendit neglegentur ius.  "
                    attribution="this is the attribution"
                    >
                    </biggive-quote>
                    <biggive-quote
                    space-below="0"
                    default-text-colour="brand-2"
                    quote="5 Lorem ipsum dolor sit amet, has quod diam dolore cu, at solet interesset eam, cu nec affert quando legendos. Ut libris aperiam quo. Et tollit intellegebat mea. Dico nostrud vivendum no his, nam ne sumo illum iudicabit. Cu nec velit argumentum, no quando offendit neglegentur ius.  "
                    attribution="this is the attribution"
                    >
                    </biggive-quote>
                  </biggive-tabbed-content>
                  `;

export const CarouselComponent = Template.bind({});
CarouselComponent.args = {
  spaceBelow: 4,
  columnCount: 3,
  buttonBackgroundColour: 'white',
  buttonIconColour: 'primary',
};
