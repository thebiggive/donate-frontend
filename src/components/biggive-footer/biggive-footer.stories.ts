export default {
  title: 'Components/Demos',
};

const Template = args => `
      <biggive-footer>
        <div slot="nav-primary-title">Match Funding Opportunities</div>
        <ul slot="nav-primary">
          <li><a href="#">Explore Campaigns</a></li>
          <li><a href="#">For Charities</a></li>
          <li><a href="#">For Funders</a></li>
          <li><a href="#">Match Funding</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Resources</a></li>
        </ul>
        <div slot="nav-secondary-title">Resources</div>
        <ul slot="nav-secondary">
          <li><a href="#">Contact us</a></li>
          <li><a href="#">Charity login</a></li>
        </ul>
        <div slot="nav-tertiary-title">About</div>
        <ul slot="nav-tertiary">
          <li><a href="#">Contact us</a></li>
          <li><a href="#">Charity login</a></li>
        </ul>
      </biggive-footer>
      `;

export const FooterComponent = Template.bind({});
FooterComponent.args = {};
