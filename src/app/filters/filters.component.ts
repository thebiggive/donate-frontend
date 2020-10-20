import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

enum FilterEnum {
  'beneficiary',
  'category',
  'country',
  'onlyMatching',
}

export type FilterType = keyof typeof FilterEnum;

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input() hasTerm: boolean;
  @Input() reset: Observable<void>;
  @Input() isHomepage: boolean;
  @Input() @Output() selectedSort: string;
  @Output() filterApplied: EventEmitter<any> = new EventEmitter();
  @Output() sortApplied: EventEmitter<any> = new EventEmitter();
  @Output() numberOfCardsApplied: EventEmitter<any> = new EventEmitter();
  @Output() clearFiltersApplied: EventEmitter<any> = new EventEmitter();

  // Listen for filter changes and set them accordingly.
  @Input()
  set selectedFilters(val: {[key: string]: any}) {
    this.setFilters(val);
  }

  public beneficiaryOptions: string[];
  public categoryOptions: string[];
  public countryOptions: string[];

  public beneficiarySelected = '';
  public categorySelected = '';
  public countrySelected = '';
  public matchingNowSelected = false;

  private defaultSort: string;
  private resetSubscription: Subscription;

  constructor() {}

  static getBeneficiaries(): string[] {
    return [
      'Children (3-18)',
      'General Public/Humankind',
      'Infants (<2)',
      'LGBTQAI',
      'Minority Groups',
      'Older People',
      'People With Disabilities',
      'Refugees/Asylum Seekers',
      'Women & Girls',
      'Young People (18-30)',
      'Other',
    ];
  }

  static getCategories(): string[] {
    return [
      'Animals',
      'Armed Forces/Emergency Services',
      'Arts/Culture/Heritage',
      'Cancer',
      'Community Support & Development',
      'Disaster Relief',
      'Education/Training/Employment',
      'Environment/Conservation',
      'Health/Wellbeing',
      'Homeless/Refuge',
      'Hospitals/Hospices',
      'Human Rights/Advocacy',
      'Information/Advice',
      'Medical Research',
      'Poverty Alleviation/Relief',
      'Religious',
      'Sports/Recreation',
      'Other',
    ];
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
      'Cote d’Ivoire',
      'Croatia',
      'Cuba',
      'Curaçao',
      'Cyprus',
      'Czech Republic',
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
      'Korea, Democratic People’s Republic of',
      'Korea, Republic of',
      'Kuwait',
      'Kyrgyzstan',
      'Lao People’s Democratic Republic',
      'Latvia',
      'Lebanon',
      'Lesotho',
      'Liberia',
      'Libyan Arab Jamahiriya',
      'Liechtenstein',
      'Lithuania',
      'Luxembourg',
      'Macao',
      'Macedonia, the former Yugoslav Republic of',
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
      'Norway',
      'Oman',
      'Pakistan',
      'Palestine',
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
      'Swaziland',
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
      'Turkey',
      'Turkmenistan',
      'Turks and Caicos Islands',
      'Tuvalu',
      'Uganda',
      'Ukraine',
      'United Arab Emirates',
      'United States',
      'Uruguay',
      'Uzbekistan',
      'Vanuatu',
      'Venezuela, Bolivarian Republic of',
      'Vietnam',
      'Virgin Islands, British',
      'Wallis and Futuna',
      'Western Sahara',
      'Yemen',
      'Zambia',
      'Zimbabwe',
    ];
  }

  ngOnInit() {
    this.defaultSort = this.selectedSort;
    this.beneficiaryOptions = FiltersComponent.getBeneficiaries();
    this.categoryOptions = FiltersComponent.getCategories();
    this.countryOptions = FiltersComponent.getCountries();

    this.resetSubscription = this.reset.subscribe(() => {
      this.selectedSort = this.defaultSort;
      this.beneficiarySelected = this.categorySelected = this.countrySelected = '';
      this.matchingNowSelected = false;
    });
  }

  ngOnDestroy() {
    this.resetSubscription.unsubscribe();
  }

  setFilter(filterName: FilterType, event: { value: string }) {
    this.filterApplied.emit({filterName, value: event.value});
  }

  setSortField(event: { value: string }) {
    this.sortApplied.emit(event.value);
  }

  clearFilters() {
    this.clearFiltersApplied.emit();
  }

  /**
   * @method setFilters
   * @desc   set the filter values according to the latest data from parent component
   */
  setFilters(filters: {[key: string]: any}) {
    this.selectedSort = filters.sortField;
    this.beneficiarySelected = filters.beneficiary ? filters.beneficiary : '';
    this.categorySelected = filters.category ? filters.category : '';
    this.countrySelected = filters.country ? filters.country : '';
    this.matchingNowSelected = filters.onlyMatching ? filters.onlyMatching : false;

    if (filters.term != null) {
      this.hasTerm = true;
      this.selectedSort = '';
    }
  }
}
