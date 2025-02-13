import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { SimpleCard } from 'app/components';
import {
  Box,
  Grid,
  Icon,
  Button,
  styled,
  useTheme,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextareaAutosize,
  Autocomplete,
} from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Span } from 'app/components/Typography';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import {
  addUpdateOffer,
  deleteOffer,
  getAllNetworks,
  getNetworksByUser,
  getOffer,
  getCategories,
} from 'app/helper/ApiUrlHelper';

// 1) Insert the full COUNTRY_LIST array somewhere accessible
// You can place this array at the top of your file or in a separate file.
const COUNTRY_LIST = [
  { code: 'LATAM', name: 'LATAM' },
  { code: 'APAC', name: 'APAC' },
  { code: 'EMEA', name: 'EMEA' },
  { code: 'International', name: 'International' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AX', name: 'Åland Islands' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia (Plurinational State of)' },
  { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'BN', name: 'Brunei Darussalam' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo (Democratic Republic of the)' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CW', name: 'Curaçao' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FK', name: 'Falkland Islands (Malvinas)' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard Island and McDonald Islands' },
  { code: 'VA', name: 'Holy See' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran (Islamic Republic of)' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: "Korea (Democratic People's Republic of)" },
  { code: 'KR', name: 'Korea (Republic of)' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: "Lao People's Democratic Republic" },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia (Federated States of)' },
  { code: 'MD', name: 'Moldova (Republic of)' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestine' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Réunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russian Federation' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BL', name: 'Saint Barthélemy' },
  { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'MF', name: 'Saint Martin (French part)' },
  { code: 'PM', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SX', name: 'Sint Maarten (Dutch part)' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania, United Republic of' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TC', name: 'Turks and Caicos Islands' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom of Great Britain and Northern Ireland' },
  { code: 'UM', name: 'United States Minor Outlying Islands' },
  { code: 'US', name: 'United States of America' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela (Bolivarian Republic of)' },
  { code: 'VN', name: 'Viet Nam' },
  { code: 'VG', name: 'Virgin Islands (British)' },
  { code: 'VI', name: 'Virgin Islands (U.S.)' },
  { code: 'WF', name: 'Wallis and Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const TextField = styled(TextValidator)(({ theme, readOnly }) => ({
  width: '100%',
  marginBottom: '16px',
  ...(readOnly && {
    backgroundColor: theme.palette.action.disabledBackground,
  }),
}));

const statusOptions = [
  { label: 'Unapproved', value: 0 },
  { label: 'Approved', value: 1 },
  { label: 'Rejected', value: 2 },
];

// NEW: Payout type options
const payoutTypeOptions = [
  { label: 'flat', value: 'flat' },
  { label: 'percentage', value: 'percentage' },
];

// NEW: Tracking type options
const trackingTypeOptions = [
  { label: 'online', value: 'online' },
  { label: 'offline', value: 'offline' },
];

const AddUpdateOffer = () => {
  let location = useLocation();
  let id = location?.state?.data || 0;
  let roleid = localStorage.getItem('roleId');

  const [state, setState] = useState({ id: id });
  const [editImage, setEditImage] = useState(false);

  // Networks
  const [networks, setNetworks] = useState([]);

  // Categories
  const [allCategories, setAllCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);

  // Countries
  const [selectedCountries, setSelectedCountries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);

    // 1) Fetch Networks
    const fetchNetworks = roleid !== '2' ? getNetworksByUser() : getAllNetworks();
    axios({
      method: 'post',
      headers: {
        token: localStorage.getItem('accessToken'),
        roleid: localStorage.getItem('roleId'),
      },
      url: fetchNetworks,
      data: {},
    })
      .then((response) => {
        if (response.data.errorCode === 0) {
          setNetworks(response.data.data);
        } else {
          const message = response.data.message;
          if (['Invalid Token 1', 'Invalid Token 2', 'Invalid Token 3'].includes(message)) {
            alert('Session Expired, please relogin');
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching networks:', error);
      });

    // 2) Fetch Categories
    axios({
      method: 'post',
      headers: {
        token: localStorage.getItem('accessToken'),
        roleid: localStorage.getItem('roleId'),
      },
      url: getCategories(),
      data: {},
    })
      .then((res) => {
        if (res.data.errorCode === 0) {
          setAllCategories(res.data.data);
        } else {
          const message = res.data.message;
          if (['Invalid Token 1', 'Invalid Token 2', 'Invalid Token 3'].includes(message)) {
            alert('Session Expired, please relogin');
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });

    // 3) If editing an existing offer, fetch its details
    if (id) {
      axios({
        method: 'post',
        headers: {
          token: localStorage.getItem('accessToken'),
          roleid: localStorage.getItem('roleId'),
        },
        url: getOffer(),
        data: { id: id },
      })
        .then((response) => {
          setLoading(false);
          if (response.data.errorCode === 0) {
            const offerData = response.data.data;
            setState(offerData);
            setStatus(offerData.status || 0);

            // Convert "4,5" into [4, 5]
            if (offerData.category_ids && typeof offerData.category_ids === 'string') {
              const catArray = offerData.category_ids
                .split(',')
                .map((str) => Number(str.trim()))
                .filter((num) => !isNaN(num));
              setCategoryIds(catArray);
            }

            // Convert "AF,AL" into ["AF", "AL"]
            if (offerData.geo && typeof offerData.geo === 'string') {
              const geoArray = offerData.geo.split(',').map((c) => c.trim());
              setSelectedCountries(geoArray);
            }
          } else {
            const message = response.data.message;
            if (['Invalid Token 1', 'Invalid Token 2', 'Invalid Token 3'].includes(message)) {
              alert('Session Expired, please relogin');
              window.location.href = '/session/signin';
            } else {
              alert(message);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error fetching offer:', error);
        });
    } else {
      // If not editing an offer, just stop the loader
      setLoading(false);
    }
  }, [id, roleid, location?.state?.data]);

  // --------------------------------------------------------------------
  // Submit Handler
  // --------------------------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault();

    let choice = window.confirm('Are you sure you want to add/update this offer?');
    if (!choice) return;

    setLoading(true);

    // alert(JSON.stringify(state));

    const { category_ids, ...rest } = state;

    const formData = new FormData();
    for (const key in rest) {
      formData.append(key, state[key]);
    }

    // Status
    formData.set('status', status);

    categoryIds.forEach((catId) => {
      formData.append('category_ids[]', Number(catId));
    });

    // Countries as JSON string (e.g. ["US","GB","IN"])
    formData.set('geo', JSON.stringify(selectedCountries));

    // console.log('[DEBUG] Final categoryIds to be sent:', categoryIds);
    // console.log('[DEBUG] formData category_ids:', formData.getAll('category_ids[]'));

    axios({
      method: 'post',
      headers: {
        token: localStorage.getItem('accessToken'),
        roleid: localStorage.getItem('roleId'),
      },
      url: addUpdateOffer(),
      data: formData,
    })
      .then((response) => {
        setLoading(false);
        if (response.data.errorCode === 0) {
          alert(response.data.message);
          // Redirect based on role
          window.location.href = roleid !== '2' ? '/network' : '/offer';
        } else {
          const message = response.data.message;
          if (['Invalid Token 1', 'Invalid Token 2', 'Invalid Token 3'].includes(message)) {
            alert('Session Expired, please relogin');
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error adding/updating offer:', err);
        alert('An error occurred while saving the offer.');
      });
  };

  // --------------------------------------------------------------------
  // Delete Handlers
  // --------------------------------------------------------------------
  const handleDelete = () => {
    if (roleid === '2') {
      setDeleteDialogOpen(true);
    } else {
      setConfirmationDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    deleteOfferRequest(null);
    setConfirmationDialogOpen(false);
  };

  const deleteOfferRequest = (remarks) => {
    setLoading(true);
    axios({
      method: 'post',
      headers: {
        token: localStorage.getItem('accessToken'),
        roleid: localStorage.getItem('roleId'),
      },
      url: deleteOffer(),
      data: { id: id, remarks: remarks },
    })
      .then((response) => {
        setLoading(false);
        if (response.data.errorCode === 0) {
          alert(response.data.message);
          window.location.href = roleid !== '2' ? '/network' : '/offer';
        } else {
          const message = response.data.message;
          if (['Invalid Token 1', 'Invalid Token 2', 'Invalid Token 3'].includes(message)) {
            alert('Session Expired, please relogin');
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Error deleting offer:', err);
        alert('An error occurred while deleting the offer.');
      });
  };

  // --------------------------------------------------------------------
  // Form Field Change Handlers
  // --------------------------------------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target
    setState((prev) => ({ ...prev, [name]: value }))
  }


  const handleNetworkChange = (value) => {
    setState((prev) => ({ ...prev, network_id: value }));
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  // --------------------------------------------------------------------
  // Image Upload Handler
  // --------------------------------------------------------------------
  const imageUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      if (allowedExtensions.includes(fileExtension)) {
        setState((prev) => ({ ...prev, img: selectedFile }));
      } else {
        alert('Please select a valid image file (jpg, jpeg, png)');
      }
    } else {
      alert('Please select a file');
    }
  };

  const handleImageChange = () => {
    setEditImage(!editImage);
  };

  // --------------------------------------------------------------------
  // Delete Dialog for Role 2 (with remarks)
  // --------------------------------------------------------------------
  const handleDeleteDialogClose = (confirm) => {
    if (confirm) {
      if (!remarks || remarks.trim() === '') {
        setRemarksError(true);
      } else {
        setRemarksError(false);
        setDeleteDialogOpen(false);
        deleteOfferRequest(remarks);
      }
    } else {
      setDeleteDialogOpen(false);
    }
  };

  // --------------------------------------------------------------------
  // Destructure fields from state
  // --------------------------------------------------------------------
  const {
    name,
    description,
    payout,
    geo,
    offer_link,
    img,
    payout_type,
    tracking_type,
  } = state;

  return (
    <>
      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <CircularProgress />
          <br />
        </Box>
      ) : (
        <Container>
          <SimpleCard title="Add/Update Offer">
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
              <Grid container spacing={6}>
                {/* -------------------------------------
                    LEFT COLUMN
                -------------------------------------- */}
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  {/* Network */}
                  <Autocomplete
                    id="tags-outlined"
                    options={networks || []}
                    value={
                      networks?.length
                        ? networks.find((network) => network.id === state.network_id) || null
                        : null
                    }
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      if (newValue) handleNetworkChange(newValue.id);
                      else handleNetworkChange(0);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        variant="outlined"
                        label="Network"
                        placeholder="Network"
                        fullWidth
                      />
                    )}
                  />

                  {/* Name */}
                  <TextField
                    type="text"
                    name="name"
                    label="Name"
                    onChange={handleChange}
                    value={name || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />

                  {/* Description */}
                  <TextField
                    type="text"
                    name="description"
                    label="Description"
                    onChange={handleChange}
                    value={description || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />

                  {/* Payout */}
                  <TextField
                    type="number"
                    name="payout"
                    label="Payout"
                    onChange={handleChange}
                    value={payout || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />

                  {/* Payout Type (Select) */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                      name="payout_type"
                      value={payout_type || ''}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="">Select Payout Type</MenuItem>
                      {payoutTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Multi-Select Categories */}
                  <Autocomplete
                    multiple
                    id="categories-select"
                    options={allCategories}
                    getOptionLabel={(option) => option.name}
                    value={allCategories.filter((cat) => categoryIds.includes(cat.id))}
                    onChange={(event, newValue) => {
                      console.log("[DEBUG] New selected categories:", newValue);
                      const updatedCategoryIds = newValue.map((cat) => cat.id);
                      console.log("[DEBUG] Updated categoryIds:", updatedCategoryIds);
                      setCategoryIds(updatedCategoryIds);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Categories"
                        placeholder="Select categories"
                        fullWidth
                      />
                    )}
                  />


                  {/* Show status dropdown only for role 2 */}
                  {roleid === '2' && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Select value={status} onChange={handleStatusChange} displayEmpty>
                        <MenuItem value="">Select Status</MenuItem>
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {/* Image Upload (Add / Edit) */}
                  {!id ? (
                    <>
                      <label>Offer Image (50x50): </label>
                      <TextField type="file" name="img" onChange={imageUpload} />
                    </>
                  ) : (
                    !editImage && (
                      <>
                        <Button color="warning" variant="contained" onClick={handleImageChange}>
                          <Icon>edit</Icon>
                          <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Update Image</Span>
                        </Button>
                        <br />
                        <br />
                      </>
                    )
                  )}

                  {/* If editing image */}
                  {editImage && (
                    <>
                      <label>Offer Image (50x50): </label>
                      <TextField type="file" name="img" onChange={imageUpload} />
                    </>
                  )}
                </Grid>

                {/* -------------------------------------
                    RIGHT COLUMN
                -------------------------------------- */}
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                  {/* Offer Link */}
                  <TextField
                    type="text"
                    name="offer_link"
                    label="Offer Link"
                    value={offer_link || ''}
                    onChange={handleChange}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />

                  {/* Tracking Type (Select) */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                      name="tracking_type"
                      value={tracking_type || ''}
                      onChange={handleChange}
                      displayEmpty
                    >
                      <MenuItem value="">Select Tracking Type</MenuItem>
                      {trackingTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Multi-Select Countries */}
                  <Autocomplete
                    multiple
                    id="countries-select"
                    options={COUNTRY_LIST}
                    getOptionLabel={(option) => option.name}
                    // Convert selected country codes to actual country objects
                    value={COUNTRY_LIST.filter((c) => selectedCountries.includes(c.code))}
                    onChange={(event, newValue) => {
                      setSelectedCountries(newValue.map((item) => item.code));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Countries"
                        placeholder="Select countries"
                        fullWidth
                      />
                    )}
                  />

                  {/* Save Button */}
                  <Button color="success" variant="contained" type="submit" sx={{ mt: 2 }}>
                    <Icon>send</Icon>
                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Save</Span>
                  </Button>

                  {/* Delete Button (only if existing offer) */}
                  {id !== 0 && (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={handleDelete}
                      sx={{ mt: 2, ml: 2 }}
                    >
                      <Icon>delete</Icon>
                      <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Delete</Span>
                    </Button>
                  )}
                </Grid>
              </Grid>
            </ValidatorForm>
          </SimpleCard>

          {/* ----------------------------------------------------
               Delete Dialog for Role 2 (requires remarks)
          ----------------------------------------------------- */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => handleDeleteDialogClose(false)}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Delete Offer</DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete this offer? Please provide remarks if any.
              </DialogContentText>
              <TextareaAutosize
                aria-label="Remarks"
                minRows={3}
                placeholder="Remarks"
                style={{ width: '100%', marginTop: '10px' }}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              {remarksError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  Remarks are required.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDeleteDialogClose(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleDeleteDialogClose(true)} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* ----------------------------------------------------
               Confirmation Dialog for Non-Role-2
          ----------------------------------------------------- */}
          <Dialog
            open={confirmationDialogOpen}
            onClose={() => setConfirmationDialogOpen(false)}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
          >
            <DialogTitle id="confirmation-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText id="confirmation-dialog-description">
                Are you sure you want to delete this offer?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmationDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </>
  );
};

export default AddUpdateOffer;
