export default {
  title: 'Components/Header and Footer',
};

const Template = args => `
    <biggive-header
      space-below="${args.spaceBelow}"
      >
      <div slot="social-icons">
        <biggive-social-icon service="Facebook" url="https://www.facebook.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        <biggive-social-icon service="Twitter" url="https://www.twitter.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        <biggive-social-icon service="LinkedIn" url="https://www.linkedin.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        <biggive-social-icon service="YouTube" url="https://www.youtube.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        <biggive-social-icon service="Instagram" url="https://www.instagram.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
      </div>
      <div class="nav-toggle"></div>
      <ul slot="nav-primary">
          <li><a href="#">Explore Campaigns</a></li>
          <li><a href="#">For Charities</a></li>
          <li><a href="#">For Funders</a></li>
          <li>
            <a href="">Match Funding</a>
            <ul>
              <li><a href="#">Sub menu 1</a></li>
              <li><a href="# class="icon-green">Sub menu 2</a></li>
              <li><a href="#">Sub menu 3</a></li>
              <li><a href="#">Sub menu 4</a></li>
              <li><a href="#">Sub menu 5</a></li>
            </ul>
          </li>
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
HeaderComponent.args = {
  spaceBelow: '0',
  logoUrl: '/',
};
