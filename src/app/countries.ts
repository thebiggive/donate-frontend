/**
 * Taken from `country-code-lookup` version 0.0.20. Decoupled from the dependency to avoid
 * runtime processing and (primarily) to fix the performance impact of using a CommonJS
 * module. ("Warning: /usr/src/app/src/app/donation-start/donation-start.component.ts depends on
 * 'country-code-lookup'. CommonJS or AMD dependencies can cause optimization bailouts.)"
 *
 * One-time code used to sort and map the `countries`:
 *
 * let countryOptions = countries.sort((cA, cB)  => cA.country.localeCompare(cB.country))
 *   .map(country => {
 *     return {
 *       country: country.country,
 *       iso2: country.iso2,
 *     }
 *   });
 */
export const COUNTRIES: { country: string, iso2: string }[] = [
  {
    "country": "Afghanistan",
    "iso2": "AF"
  },
  {
    "country": "Åland Islands",
    "iso2": "AX"
  },
  {
    "country": "Albania",
    "iso2": "AL"
  },
  {
    "country": "Algeria",
    "iso2": "DZ"
  },
  {
    "country": "American Samoa",
    "iso2": "AS"
  },
  {
    "country": "Andorra",
    "iso2": "AD"
  },
  {
    "country": "Angola",
    "iso2": "AO"
  },
  {
    "country": "Anguilla",
    "iso2": "AI"
  },
  {
    "country": "Antarctica",
    "iso2": "AQ"
  },
  {
    "country": "Antigua and Barbuda",
    "iso2": "AG"
  },
  {
    "country": "Argentina",
    "iso2": "AR"
  },
  {
    "country": "Armenia",
    "iso2": "AM"
  },
  {
    "country": "Aruba",
    "iso2": "AW"
  },
  {
    "country": "Australia",
    "iso2": "AU"
  },
  {
    "country": "Austria",
    "iso2": "AT"
  },
  {
    "country": "Azerbaijan",
    "iso2": "AZ"
  },
  {
    "country": "Bahrain",
    "iso2": "BH"
  },
  {
    "country": "Bangladesh",
    "iso2": "BD"
  },
  {
    "country": "Barbados",
    "iso2": "BB"
  },
  {
    "country": "Belarus",
    "iso2": "BY"
  },
  {
    "country": "Belgium",
    "iso2": "BE"
  },
  {
    "country": "Belize",
    "iso2": "BZ"
  },
  {
    "country": "Benin",
    "iso2": "BJ"
  },
  {
    "country": "Bermuda",
    "iso2": "BM"
  },
  {
    "country": "Bhutan",
    "iso2": "BT"
  },
  {
    "country": "Bolivia",
    "iso2": "BO"
  },
  {
    "country": "Bonaire",
    "iso2": "BQ"
  },
  {
    "country": "Bosnia and Herzegovina",
    "iso2": "BA"
  },
  {
    "country": "Botswana",
    "iso2": "BW"
  },
  {
    "country": "Bouvet Island",
    "iso2": "BV"
  },
  {
    "country": "Brazil",
    "iso2": "BR"
  },
  {
    "country": "British Indian Ocean Territory",
    "iso2": "IO"
  },
  {
    "country": "British Virgin Islands",
    "iso2": "VG"
  },
  {
    "country": "Brunei",
    "iso2": "BN"
  },
  {
    "country": "Bulgaria",
    "iso2": "BG"
  },
  {
    "country": "Burkina Faso",
    "iso2": "BF"
  },
  {
    "country": "Burundi",
    "iso2": "BI"
  },
  {
    "country": "Cambodia",
    "iso2": "KH"
  },
  {
    "country": "Cameroon",
    "iso2": "CM"
  },
  {
    "country": "Canada",
    "iso2": "CA"
  },
  {
    "country": "Cape Verde",
    "iso2": "CV"
  },
  {
    "country": "Cayman Islands",
    "iso2": "KY"
  },
  {
    "country": "Central African Republic",
    "iso2": "CF"
  },
  {
    "country": "Chad",
    "iso2": "TD"
  },
  {
    "country": "Chile",
    "iso2": "CL"
  },
  {
    "country": "China",
    "iso2": "CN"
  },
  {
    "country": "Christmas Island",
    "iso2": "CX"
  },
  {
    "country": "Cocos (Keeling) Islands",
    "iso2": "CC"
  },
  {
    "country": "Colombia",
    "iso2": "CO"
  },
  {
    "country": "Comoros",
    "iso2": "KM"
  },
  {
    "country": "Cook Islands",
    "iso2": "CK"
  },
  {
    "country": "Costa Rica",
    "iso2": "CR"
  },
  {
    "country": "Cote d'Ivoire",
    "iso2": "CI"
  },
  {
    "country": "Croatia",
    "iso2": "HR"
  },
  {
    "country": "Cuba",
    "iso2": "CU"
  },
  {
    "country": "Curaçao",
    "iso2": "CW"
  },
  {
    "country": "Cyprus",
    "iso2": "CY"
  },
  {
    "country": "Czech Republic",
    "iso2": "CZ"
  },
  {
    "country": "Democratic Republic of the Congo",
    "iso2": "CD"
  },
  {
    "country": "Denmark",
    "iso2": "DK"
  },
  {
    "country": "Djibouti",
    "iso2": "DJ"
  },
  {
    "country": "Dominica",
    "iso2": "DM"
  },
  {
    "country": "Dominican Republic",
    "iso2": "DO"
  },
  {
    "country": "Ecuador",
    "iso2": "EC"
  },
  {
    "country": "Egypt",
    "iso2": "EG"
  },
  {
    "country": "El Salvador",
    "iso2": "SV"
  },
  {
    "country": "Equatorial Guinea",
    "iso2": "GQ"
  },
  {
    "country": "Eritrea",
    "iso2": "ER"
  },
  {
    "country": "Estonia",
    "iso2": "EE"
  },
  {
    "country": "Eswatini",
    "iso2": "SZ"
  },
  {
    "country": "Ethiopia",
    "iso2": "ET"
  },
  {
    "country": "Falkland Islands (Islas Malvinas)",
    "iso2": "FK"
  },
  {
    "country": "Faroe Islands",
    "iso2": "FO"
  },
  {
    "country": "Federated States of Micronesia",
    "iso2": "FM"
  },
  {
    "country": "Fiji",
    "iso2": "FJ"
  },
  {
    "country": "Finland",
    "iso2": "FI"
  },
  {
    "country": "France",
    "iso2": "FR"
  },
  {
    "country": "French Guiana",
    "iso2": "GF"
  },
  {
    "country": "French Polynesia",
    "iso2": "PF"
  },
  {
    "country": "French Southern and Antarctic Lands",
    "iso2": "TF"
  },
  {
    "country": "Gabon",
    "iso2": "GA"
  },
  {
    "country": "Georgia",
    "iso2": "GE"
  },
  {
    "country": "Germany",
    "iso2": "DE"
  },
  {
    "country": "Ghana",
    "iso2": "GH"
  },
  {
    "country": "Gibraltar",
    "iso2": "GI"
  },
  {
    "country": "Greece",
    "iso2": "GR"
  },
  {
    "country": "Greenland",
    "iso2": "GL"
  },
  {
    "country": "Grenada",
    "iso2": "GD"
  },
  {
    "country": "Guadeloupe",
    "iso2": "GP"
  },
  {
    "country": "Guam",
    "iso2": "GU"
  },
  {
    "country": "Guatemala",
    "iso2": "GT"
  },
  {
    "country": "Guernsey",
    "iso2": "GG"
  },
  {
    "country": "Guinea",
    "iso2": "GN"
  },
  {
    "country": "Guinea-Bissau",
    "iso2": "GW"
  },
  {
    "country": "Guyana",
    "iso2": "GY"
  },
  {
    "country": "Haiti",
    "iso2": "HT"
  },
  {
    "country": "Heard Island and McDonald Islands",
    "iso2": "HM"
  },
  {
    "country": "Holy See (Vatican City)",
    "iso2": "VA"
  },
  {
    "country": "Honduras",
    "iso2": "HN"
  },
  {
    "country": "Hong Kong",
    "iso2": "HK"
  },
  {
    "country": "Hungary",
    "iso2": "HU"
  },
  {
    "country": "Iceland",
    "iso2": "IS"
  },
  {
    "country": "India",
    "iso2": "IN"
  },
  {
    "country": "Indonesia",
    "iso2": "ID"
  },
  {
    "country": "Iran",
    "iso2": "IR"
  },
  {
    "country": "Iraq",
    "iso2": "IQ"
  },
  {
    "country": "Ireland",
    "iso2": "IE"
  },
  {
    "country": "Isle of Man",
    "iso2": "IM"
  },
  {
    "country": "Israel",
    "iso2": "IL"
  },
  {
    "country": "Italy",
    "iso2": "IT"
  },
  {
    "country": "Jamaica",
    "iso2": "JM"
  },
  {
    "country": "Japan",
    "iso2": "JP"
  },
  {
    "country": "Jersey",
    "iso2": "JE"
  },
  {
    "country": "Jordan",
    "iso2": "JO"
  },
  {
    "country": "Kazakhstan",
    "iso2": "KZ"
  },
  {
    "country": "Kenya",
    "iso2": "KE"
  },
  {
    "country": "Kiribati",
    "iso2": "KI"
  },
  {
    "country": "Kuwait",
    "iso2": "KW"
  },
  {
    "country": "Kyrgyzstan",
    "iso2": "KG"
  },
  {
    "country": "Laos",
    "iso2": "LA"
  },
  {
    "country": "Latvia",
    "iso2": "LV"
  },
  {
    "country": "Lebanon",
    "iso2": "LB"
  },
  {
    "country": "Lesotho",
    "iso2": "LS"
  },
  {
    "country": "Liberia",
    "iso2": "LR"
  },
  {
    "country": "Libya",
    "iso2": "LY"
  },
  {
    "country": "Liechtenstein",
    "iso2": "LI"
  },
  {
    "country": "Lithuania",
    "iso2": "LT"
  },
  {
    "country": "Luxembourg",
    "iso2": "LU"
  },
  {
    "country": "Macau",
    "iso2": "MO"
  },
  {
    "country": "Madagascar",
    "iso2": "MG"
  },
  {
    "country": "Malawi",
    "iso2": "MW"
  },
  {
    "country": "Malaysia",
    "iso2": "MY"
  },
  {
    "country": "Maldives",
    "iso2": "MV"
  },
  {
    "country": "Mali",
    "iso2": "ML"
  },
  {
    "country": "Malta",
    "iso2": "MT"
  },
  {
    "country": "Marshall Islands",
    "iso2": "MH"
  },
  {
    "country": "Martinique",
    "iso2": "MQ"
  },
  {
    "country": "Mauritania",
    "iso2": "MR"
  },
  {
    "country": "Mauritius",
    "iso2": "MU"
  },
  {
    "country": "Mayotte",
    "iso2": "YT"
  },
  {
    "country": "Mexico",
    "iso2": "MX"
  },
  {
    "country": "Moldova",
    "iso2": "MD"
  },
  {
    "country": "Monaco",
    "iso2": "MC"
  },
  {
    "country": "Mongolia",
    "iso2": "MN"
  },
  {
    "country": "Montenegro",
    "iso2": "ME"
  },
  {
    "country": "Montserrat",
    "iso2": "MS"
  },
  {
    "country": "Morocco",
    "iso2": "MA"
  },
  {
    "country": "Mozambique",
    "iso2": "MZ"
  },
  {
    "country": "Myanmar (Burma)",
    "iso2": "MM"
  },
  {
    "country": "Namibia",
    "iso2": "NA"
  },
  {
    "country": "Nauru",
    "iso2": "NR"
  },
  {
    "country": "Nepal",
    "iso2": "NP"
  },
  {
    "country": "Netherlands",
    "iso2": "NL"
  },
  {
    "country": "Netherlands Antilles",
    "iso2": "AN"
  },
  {
    "country": "New Caledonia",
    "iso2": "NC"
  },
  {
    "country": "New Zealand",
    "iso2": "NZ"
  },
  {
    "country": "Nicaragua",
    "iso2": "NI"
  },
  {
    "country": "Niger",
    "iso2": "NE"
  },
  {
    "country": "Nigeria",
    "iso2": "NG"
  },
  {
    "country": "Niue",
    "iso2": "NU"
  },
  {
    "country": "Norfolk Island",
    "iso2": "NF"
  },
  {
    "country": "North Korea",
    "iso2": "KP"
  },
  {
    "country": "North Macedonia",
    "iso2": "MK"
  },
  {
    "country": "Northern Mariana Islands",
    "iso2": "MP"
  },
  {
    "country": "Norway",
    "iso2": "NO"
  },
  {
    "country": "Oman",
    "iso2": "OM"
  },
  {
    "country": "Pakistan",
    "iso2": "PK"
  },
  {
    "country": "Palau",
    "iso2": "PW"
  },
  {
    "country": "Palestinian Territory",
    "iso2": "PS"
  },
  {
    "country": "Panama",
    "iso2": "PA"
  },
  {
    "country": "Papua New Guinea",
    "iso2": "PG"
  },
  {
    "country": "Paraguay",
    "iso2": "PY"
  },
  {
    "country": "Peru",
    "iso2": "PE"
  },
  {
    "country": "Philippines",
    "iso2": "PH"
  },
  {
    "country": "Pitcairn Islands",
    "iso2": "PN"
  },
  {
    "country": "Poland",
    "iso2": "PL"
  },
  {
    "country": "Portugal",
    "iso2": "PT"
  },
  {
    "country": "Puerto Rico",
    "iso2": "PR"
  },
  {
    "country": "Qatar",
    "iso2": "QA"
  },
  {
    "country": "Republic of Kosovo",
    "iso2": "XK"
  },
  {
    "country": "Republic of the Congo",
    "iso2": "CG"
  },
  {
    "country": "Reunion",
    "iso2": "RE"
  },
  {
    "country": "Romania",
    "iso2": "RO"
  },
  {
    "country": "Russia",
    "iso2": "RU"
  },
  {
    "country": "Rwanda",
    "iso2": "RW"
  },
  {
    "country": "Saint Barthélemy",
    "iso2": "BL"
  },
  {
    "country": "Saint Helena",
    "iso2": "SH"
  },
  {
    "country": "Saint Kitts and Nevis",
    "iso2": "KN"
  },
  {
    "country": "Saint Lucia",
    "iso2": "LC"
  },
  {
    "country": "Saint Martin",
    "iso2": "MF"
  },
  {
    "country": "Saint Pierre and Miquelon",
    "iso2": "PM"
  },
  {
    "country": "Saint Vincent and the Grenadines",
    "iso2": "VC"
  },
  {
    "country": "San Marino",
    "iso2": "SM"
  },
  {
    "country": "Sao Tome and Principe",
    "iso2": "ST"
  },
  {
    "country": "Saudi Arabia",
    "iso2": "SA"
  },
  {
    "country": "Senegal",
    "iso2": "SN"
  },
  {
    "country": "Serbia",
    "iso2": "RS"
  },
  {
    "country": "Seychelles",
    "iso2": "SC"
  },
  {
    "country": "Sierra Leone",
    "iso2": "SL"
  },
  {
    "country": "Singapore",
    "iso2": "SG"
  },
  {
    "country": "Sint Maarten",
    "iso2": "SX"
  },
  {
    "country": "Slovakia",
    "iso2": "SK"
  },
  {
    "country": "Slovenia",
    "iso2": "SI"
  },
  {
    "country": "Solomon Islands",
    "iso2": "SB"
  },
  {
    "country": "Somalia",
    "iso2": "SO"
  },
  {
    "country": "South Africa",
    "iso2": "ZA"
  },
  {
    "country": "South Georgia and the South Sandwich Islands",
    "iso2": "GS"
  },
  {
    "country": "South Korea",
    "iso2": "KR"
  },
  {
    "country": "South Sudan",
    "iso2": "SS"
  },
  {
    "country": "Spain",
    "iso2": "ES"
  },
  {
    "country": "Sri Lanka",
    "iso2": "LK"
  },
  {
    "country": "Sudan",
    "iso2": "SD"
  },
  {
    "country": "Suriname",
    "iso2": "SR"
  },
  {
    "country": "Svalbard",
    "iso2": "SJ"
  },
  {
    "country": "Sweden",
    "iso2": "SE"
  },
  {
    "country": "Switzerland",
    "iso2": "CH"
  },
  {
    "country": "Syria",
    "iso2": "SY"
  },
  {
    "country": "Taiwan",
    "iso2": "TW"
  },
  {
    "country": "Tajikistan",
    "iso2": "TJ"
  },
  {
    "country": "Tanzania",
    "iso2": "TZ"
  },
  {
    "country": "Thailand",
    "iso2": "TH"
  },
  {
    "country": "The Bahamas",
    "iso2": "BS"
  },
  {
    "country": "The Gambia",
    "iso2": "GM"
  },
  {
    "country": "Timor-Leste",
    "iso2": "TL"
  },
  {
    "country": "Togo",
    "iso2": "TG"
  },
  {
    "country": "Tokelau",
    "iso2": "TK"
  },
  {
    "country": "Tonga",
    "iso2": "TO"
  },
  {
    "country": "Trinidad and Tobago",
    "iso2": "TT"
  },
  {
    "country": "Tunisia",
    "iso2": "TN"
  },
  {
    "country": "Turkey",
    "iso2": "TR"
  },
  {
    "country": "Turkmenistan",
    "iso2": "TM"
  },
  {
    "country": "Turks and Caicos Islands",
    "iso2": "TC"
  },
  {
    "country": "Tuvalu",
    "iso2": "TV"
  },
  {
    "country": "Uganda",
    "iso2": "UG"
  },
  {
    "country": "Ukraine",
    "iso2": "UA"
  },
  {
    "country": "United Arab Emirates",
    "iso2": "AE"
  },
  {
    "country": "United Kingdom",
    "iso2": "GB"
  },
  {
    "country": "United States",
    "iso2": "US"
  },
  {
    "country": "United States Minor Outlying Islands",
    "iso2": "UM"
  },
  {
    "country": "Uruguay",
    "iso2": "UY"
  },
  {
    "country": "Uzbekistan",
    "iso2": "UZ"
  },
  {
    "country": "Vanuatu",
    "iso2": "VU"
  },
  {
    "country": "Venezuela",
    "iso2": "VE"
  },
  {
    "country": "Vietnam",
    "iso2": "VN"
  },
  {
    "country": "Virgin Islands",
    "iso2": "VI"
  },
  {
    "country": "Wallis and Futuna",
    "iso2": "WF"
  },
  {
    "country": "Western Sahara",
    "iso2": "EH"
  },
  {
    "country": "Western Samoa",
    "iso2": "WS"
  },
  {
    "country": "Yemen",
    "iso2": "YE"
  },
  {
    "country": "Zambia",
    "iso2": "ZM"
  },
  {
    "country": "Zimbabwe",
    "iso2": "ZW"
  }
]

/**
 * Keys are ISO2 codes, values are names.
 */
export const countryOptions: { label: string; value: string }[] =
  COUNTRIES.map(country => ({label: country.country, value: country.iso2}));
