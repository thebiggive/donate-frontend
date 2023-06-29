export default {
  title: 'Components/Header and Footer',
};

const Template = () => `
    <biggive-main-menu>
        <div slot="social-icons">
            <biggive-social-icon service="Facebook" url="https://www.facebook.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            <biggive-social-icon service="Twitter" url="https://www.twitter.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            <biggive-social-icon service="LinkedIn" url="https://www.linkedin.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            <biggive-social-icon service="YouTube" url="https://www.youtube.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            <biggive-social-icon service="Instagram" url="https://www.instagram.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        </div>
        <div slot="mobile-social-icons">
            <biggive-social-icon service="Facebook" url="https://www.facebook.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            <biggive-social-icon service="Twitter" url="https://www.twitter.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            <biggive-social-icon service="LinkedIn" url="https://www.linkedin.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            <biggive-social-icon service="YouTube" url="https://www.youtube.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            <biggive-social-icon service="Instagram" url="https://www.instagram.com" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
        </div>
        <ul class="links" slot="nav-primary">
            <li>
                <a href="#">Explore Campaigns</a>
            </li>
            <li>
                <a href="#">Match Funding</a>
                <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>

                <ul class="sub-menu">
                    <li>
                        <a href="#">Match Funding Explained</a>
                    </li>
                    <li class="more">
                        <span>
                            <a href="#">Match Funding Opportunities</a>
                            <!-- IMPORTANT: notice this one has a class sub-sub-menu, not sub-menu -->
                            <biggive-misc-icon class="bx bxs-chevron-down sub-sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                        </span>
                        <ul class="sub-sub-menu">
                            <li>
                                <a href="#" class="icon-christmas">
                                Christmas Challenge
                                </a>
                            </li>
                            <li>
                                <a href="#" class="icon-children">
                                Champions for Children
                                </a>
                            </li>
                            <li>
                                <a href="#" class="icon-green-match">
                                Green Match Fund
                                </a>
                            </li>
                            <li>
                                <a href="#" class="icon-women-girls">
                                Women & Girls Match Fund
                                </a>
                            </li>
                            <li>
                                <a href="#" class="icon-emergency">
                                Emergency Match Fund
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Run your match funding campaign</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#">About us</a>
                <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                <ul class="sub-menu">
                    <li>
                        <a href="#">Our Story</a>
                    </li>
                    <li>
                        <a href="#">Our People</a>
                    </li>
                    <li>
                        <a href="#">Our Community</a>
                    </li>
                    <li>
                        <a href="#">Our Fees</a>
                    </li>
                    <li>
                        <a href="#">FAQs</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="#">For Charities</a>
            </li>
            <li>
                <a href="#">For Funders</a>
            </li>
            <li>
                <a href="#">Resources</a>
                <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                <ul class="sub-menu">
                    <li>
                        <a href="#">Case Studies</a>
                    </li>
                    <li>
                        <a href="#">Webinars</a>
                    </li>
                    <li>
                        <a href="#">Blog</a>
                    </li>
                    <li>
                        <a href="#">Reports & Insights</a>
                    </li>
                    <li>
                        <a href="#">Press</a>
                    </li>
                </ul>
            </li>
        </ul>
        <ul slot="nav-secondary">
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Charity login</a></li>
        </ul>
    </biggive-main-menu>
      `;

export const MainMenu = Template.bind({});
