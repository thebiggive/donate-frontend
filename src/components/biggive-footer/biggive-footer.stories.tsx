export default {
  title: 'Components/Header and Footer',
};

const Template = () => `
      <biggive-footer>
        <div slot="nav-primary-title">Match Funding Opportunities</div>
        <ul slot="nav-primary">
          <li><a href="#">Explore Campaigns</a></li>
          <li data-icon=""><a href="#">For Charities</a></li>
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
        <ul slot="nav-postscript">
          <li><a href="#">Terms and conditions</a></li>
          <li><a href="#">Privacy policy</a></li>
        </ul>
        <div slot="social-icons">
        <biggive-social-icon service="Facebook" url="https://www.facebook.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        <biggive-social-icon service="Twitter" url="https://www.twitter.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        <biggive-social-icon service="LinkedIn" url="https://www.linkedin.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        <biggive-social-icon service="YouTube" url="https://www.youtube.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        <biggive-social-icon service="Instagram" url="https://www.instagram.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
      </div>
      </biggive-footer>
      `;

export const FooterComponent = Template.bind({});
