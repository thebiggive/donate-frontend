import { Injectable } from '@angular/core';
import { IconDefinition } from '@fortawesome/angular-fontawesome';
import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
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
} from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/pro-duotone-svg-icons';
import { faHeadSideMedical, faHomeHeart } from '@fortawesome/pro-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class CampaignGroupsService {
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

  static getBeneficiaryNames(): string[] {
    const names: string[] = [];
    const beneficiaries: { name: string; icon: IconDefinition }[] = this.getBeneficiaries();

    for (let i = 0; i < beneficiaries.length; i++) {
      const beneficiaryObj: { name: string; icon: IconDefinition } = beneficiaries[i]!;
      names.push(beneficiaryObj.name);
    }

    return names;
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

  static getCategoryNames(): string[] {
    const names: string[] = [];
    const categories: { name: string; icon: IconDefinition }[] = this.getCategories();

    for (let i = 0; i < categories.length; i++) {
      const categoryObj: { name: string; icon: IconDefinition } = categories[i]!;
      names.push(categoryObj.name);
    }

    return names;
  }

  /**
   * Adapted from https://help.salesforce.com/articleView?id=admin_state_country_picklists_standard_countries.htm&type=5
   */
  static getCountries(): string[] {
    return [
      'United Kingdom',
      'Afghanistan',
      'Aland Islands',
      'Albania',
      'Algeria',
      'Andorra',
      'Angola',
      'Anguilla',
      'Antarctica',
      'Antigua and Barbuda',
      'Argentina',
      'Armenia',
      'Aruba',
      'Australia',
      'Austria',
      'Azerbaijan',
      'Bahamas',
      'Bahrain',
      'Bangladesh',
      'Barbados',
      'Belarus',
      'Belgium',
      'Belize',
      'Benin',
      'Bermuda',
      'Bhutan',
      'Bolivia, Plurinational State of',
      'Bonaire, Sint Eustatius and Saba',
      'Bosnia and Herzegovina',
      'Botswana',
      'Bouvet Island',
      'Brazil',
      'British Indian Ocean Territory',
      'Brunei Darussalam',
      'Bulgaria',
      'Burkina Faso',
      'Burundi',
      'Cambodia',
      'Cameroon',
      'Canada',
      'Cape Verde',
      'Cayman Islands',
      'Central African Republic',
      'Chad',
      'Chile',
      'China',
      'Christmas Island',
      'Cocos (Keeling) Islands',
      'Colombia',
      'Comoros',
      'Congo',
      'Congo, the Democratic Republic of the',
      'Cook Islands',
      'Costa Rica',
      "Cote d'Ivoire",
      'Croatia',
      'Cuba',
      'Curaçao',
      'Cyprus',
      'Czechia',
      'Denmark',
      'Djibouti',
      'Dominica',
      'Dominican Republic',
      'Ecuador',
      'Egypt',
      'El Salvador',
      'Equatorial Guinea',
      'Eritrea',
      'Estonia',
      'Eswatini',
      'Ethiopia',
      'Falkland Islands (Malvinas)',
      'Faroe Islands',
      'Fiji',
      'Finland',
      'France',
      'French Guiana',
      'French Polynesia',
      'French Southern Territories',
      'Gabon',
      'Gambia',
      'Georgia',
      'Germany',
      'Ghana',
      'Gibraltar',
      'Greece',
      'Greenland',
      'Grenada',
      'Guadeloupe',
      'Guatemala',
      'Guernsey',
      'Guinea',
      'Guinea-Bissau',
      'Guyana',
      'Haiti',
      'Heard Island and McDonald Islands',
      'Holy See (Vatican City State)',
      'Honduras',
      'Hungary',
      'Iceland',
      'India',
      'Indonesia',
      'Iran, Islamic Republic of',
      'Iraq',
      'Ireland',
      'Isle of Man',
      'Israel',
      'Italy',
      'Jamaica',
      'Japan',
      'Jersey',
      'Jordan',
      'Kazakhstan',
      'Kenya',
      'Kiribati',
      "Korea, Democratic People's Republic of",
      'Korea, Republic of',
      'Kosovo',
      'Kuwait',
      'Kyrgyzstan',
      "Lao People's Democratic Republic",
      'Latvia',
      'Lebanon',
      'Lesotho',
      'Liberia',
      'Libyan Arab Jamahiriya',
      'Liechtenstein',
      'Lithuania',
      'Luxembourg',
      'Macao',
      'Madagascar',
      'Malawi',
      'Malaysia',
      'Maldives',
      'Mali',
      'Malta',
      'Martinique',
      'Mauritania',
      'Mauritius',
      'Mayotte',
      'Mexico',
      'Moldova, Republic of',
      'Monaco',
      'Mongolia',
      'Montenegro',
      'Montserrat',
      'Morocco',
      'Mozambique',
      'Myanmar',
      'Namibia',
      'Nauru',
      'Nepal',
      'Netherlands',
      'New Caledonia',
      'New Zealand',
      'Nicaragua',
      'Niger',
      'Nigeria',
      'Niue',
      'Norfolk Island',
      'North Macedonia',
      'Norway',
      'Oman',
      'Pakistan',
      'Palestinian Territory, Occupied',
      'Panama',
      'Papua New Guinea',
      'Paraguay',
      'Peru',
      'Philippines',
      'Pitcairn',
      'Poland',
      'Portugal',
      'Qatar',
      'Reunion',
      'Romania',
      'Russian Federation',
      'Rwanda',
      'Saint Barthélemy',
      'Saint Helena, Ascension and Tristan da Cunha',
      'Saint Kitts and Nevis',
      'Saint Lucia',
      'Saint Martin (French part)',
      'Saint Pierre and Miquelon',
      'Saint Vincent and the Grenadines',
      'Samoa',
      'San Marino',
      'Sao Tome and Principe',
      'Saudi Arabia',
      'Senegal',
      'Serbia',
      'Seychelles',
      'Sierra Leone',
      'Singapore',
      'Sint Maarten (Dutch part)',
      'Slovakia',
      'Slovenia',
      'Solomon Islands',
      'Somalia',
      'South Africa',
      'South Georgia and the South Sandwich Islands',
      'South Sudan',
      'Spain',
      'Sri Lanka',
      'Sudan',
      'Suriname',
      'Svalbard and Jan Mayen',
      'Sweden',
      'Switzerland',
      'Syrian Arab Republic',
      'Taiwan',
      'Tajikistan',
      'Tanzania, United Republic of',
      'Thailand',
      'Timor-Leste',
      'Togo',
      'Tokelau',
      'Tonga',
      'Trinidad and Tobago',
      'Tunisia',
      'Turkmenistan',
      'Turks and Caicos Islands',
      'Tuvalu',
      'Türkiye',
      'Uganda',
      'Ukraine',
      'United Arab Emirates',
      'United States',
      'Uruguay',
      'Uzbekistan',
      'Vanuatu',
      'Venezuela, Bolivarian Republic of',
      'Viet Nam',
      'Virgin Islands, British',
      'Wallis and Futuna',
      'Western Sahara',
      'Yemen',
      'Zambia',
      'Zimbabwe',
    ];
  }

  static getBeneficiaryIcon(beneficiary: string): IconDefinition {
    const matchingItems = CampaignGroupsService.getBeneficiaries().filter((ii) => ii.name === beneficiary);

    // For an unknown/invalid beneficiary, show 'other' symbol.
    return (matchingItems[0] && matchingItems[0].icon) || faPlus;
  }

  static getCategoryIcon(category: string): IconDefinition {
    const matchingItems = CampaignGroupsService.getCategories().filter((ii) => ii.name === category);

    // For an unknown/invalid category, show 'other' symbol.
    return matchingItems[0]?.icon || faPlus;
  }
}
