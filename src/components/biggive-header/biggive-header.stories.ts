export default {
  title: 'Components/Demos',
};

const Template = args => `
    <biggive-header>
      <ul slot="nav-primary">
        <li><a href="#">Explore Campaigns</a></li>
        <li><a href="#">For Charities</a></li>
        <li><a href="#">For Funders</a></li>
        <li><a href="#">Match Funding</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Resources</a></li>
      </ul>
      <ul slot="nav-secondary">
        <li><a href="#">Contact us</a></li>
        <li><a href="#">Charity login</a></li>
      </ul>
    </biggive-header>
    `;

export const HeaderComponent = Template.bind({});
HeaderComponent.args = {};
