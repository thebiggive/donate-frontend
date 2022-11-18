import { faAccessibleIcon, IconDefinition, faFacebookF, faTwitter, faYoutube, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import {
  faBaby,
  faBalanceScale,
  faBlind,
  faBook,
  faCampground,
  faChild,
  faFutbol,
  faHeartbeat,
  faHospital,
  faInfoCircle,
  faMedal,
  faMicroscope,
  faMortarPestle,
  faParachuteBox,
  faPaw,
  faPeopleCarry,
  faPlaceOfWorship,
  faPlus,
  faRainbow,
  faRibbon,
  faSeedling,
  faTheaterMasks,
  faUniversalAccess,
  faUserGraduate,
  faVenus,
} from '@fortawesome/pro-solid-svg-icons';
import { faUsers } from '@fortawesome/pro-duotone-svg-icons';
import { faHeadSideMedical, faHomeHeart, faHeart, faAlarmClock } from '@fortawesome/pro-solid-svg-icons';
import { faTimer } from '@fortawesome/pro-regular-svg-icons';

export class FontAwesomeIconsService {
  static getBeneficiaries(): Array<{ name: string; icon: IconDefinition }> {
    return [
      {
        name: 'Children (3-18)',
        icon: faChild,
      },
      {
        name: 'General Public/Humankind',
        icon: faUniversalAccess,
      },
      {
        name: 'Infants (<2)',
        icon: faBaby,
      },
      {
        name: 'LGBTQAI',
        icon: faRainbow,
      },
      {
        name: 'Minority Groups',
        icon: faUsers,
      },
      {
        name: 'Older People',
        icon: faBlind,
      },
      {
        name: 'People With Disabilities',
        icon: faAccessibleIcon,
      },
      {
        name: 'Refugees/Asylum Seekers',
        icon: faCampground,
      },
      {
        name: 'Women & Girls',
        icon: faVenus,
      },
      {
        name: 'Young People (18-30)',
        icon: faUserGraduate,
      },
      {
        name: 'Other',
        icon: faPlus,
      },
    ];
  }

  static getSocials(): Array<{ name: string; icon: IconDefinition }> {
    return [
      {
        name: 'Facebook',
        icon: faFacebookF,
      },
      {
        name: 'Twitter',
        icon: faTwitter,
      },
      {
        name: 'Instagram',
        icon: faInstagram,
      },
      {
        name: 'YouTube',
        icon: faYoutube,
      },
      {
        name: 'LinkedIn',
        icon: faLinkedinIn,
      },
    ];
  }

  static getMisc(): Array<{ name: string; icon: IconDefinition }> {
    return [
      {
        name: 'AlarmClock',
        icon: faAlarmClock,
      },
      {
        name: 'Heart',
        icon: faHeart,
      },
      {
        name: 'Timer',
        icon: faTimer,
      },
    ];
  }

  static getCategories(): Array<{ name: string; icon: IconDefinition }> {
    return [
      {
        name: 'Animals',
        icon: faPaw,
      },
      {
        name: 'Armed Forces/Emergency Services',
        icon: faMedal,
      },
      {
        name: 'Arts/Culture/Heritage',
        icon: faTheaterMasks,
      },
      {
        name: 'Cancer',
        icon: faRibbon,
      },
      {
        name: 'Community Support & Development',
        icon: faPeopleCarry,
      },
      {
        name: 'Disaster Relief',
        icon: faParachuteBox,
      },
      {
        name: 'Education/Training/Employment',
        icon: faBook,
      },
      {
        name: 'Environment/Conservation',
        icon: faSeedling,
      },
      {
        name: 'Health/Wellbeing',
        icon: faHeartbeat,
      },
      {
        name: 'Homeless/Refuge',
        icon: faHomeHeart,
      },
      {
        name: 'Hospitals/Hospices',
        icon: faHospital,
      },
      {
        name: 'Human Rights/Advocacy',
        icon: faBalanceScale,
      },
      {
        name: 'Information/Advice',
        icon: faInfoCircle,
      },
      {
        name: 'Medical Research',
        icon: faMicroscope,
      },
      {
        name: 'Mental Health',
        icon: faHeadSideMedical,
      },
      {
        name: 'Poverty Alleviation/Relief',
        icon: faMortarPestle,
      },
      {
        name: 'Religious',
        icon: faPlaceOfWorship,
      },
      {
        name: 'Sports/Recreation',
        icon: faFutbol,
      },
      {
        name: 'Other',
        icon: faPlus,
      },
    ];
  }

  static getBeneficiaryIcon(beneficiary: string): IconDefinition {
    const matchingItems = FontAwesomeIconsService.getBeneficiaries().filter(ii => ii.name === beneficiary);

    // For an unknown/invalid beneficiary, show 'other' symbol.
    return matchingItems[0].icon || faPlus;
  }

  static getMiscIcon(misc: string): IconDefinition {
    const matchingItems = FontAwesomeIconsService.getMisc().filter(ii => ii.name === misc);

    // For an unknown/invalid beneficiary, show 'other' symbol.
    return matchingItems[0].icon || faPlus;
  }

  static getSocialIcon(social: string): IconDefinition {
    const matchingItems = FontAwesomeIconsService.getSocials().filter(ii => ii.name === social);

    // For an unknown/invalid beneficiary, show 'other' symbol.
    return matchingItems[0].icon || faPlus;
  }

  static getCategoryIcon(category: string): IconDefinition {
    const matchingItems = FontAwesomeIconsService.getCategories().filter(ii => ii.name === category);

    // For an unknown/invalid category, show 'other' symbol.
    return matchingItems[0]?.icon || faPlus;
  }
}
