import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { SimpleCard } from 'app/components';
import {
  Box,
  Grid,
  Icon,
  IconButton,
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Span } from 'app/components/Typography';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Autocomplete } from '@mui/material';
import { updateUser, getUser } from 'app/helper/ApiUrlHelper';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const TextField = styled(TextValidator)(() => ({
  width: '100%',
  marginBottom: '16px',
}));

const AddUpdateTrafficSources = () => {
  let location = useLocation();
  let id = location?.state?.data || 0;

  const [state, setState] = useState({ id: id });
  const [loading, setLoading] = useState(false);
  const [inputCountryValue, setInputCountryValue] = useState('');

  const countries = [
    { "label": "Afghanistan" },
    { "label": "Albania" },
    { "label": "Algeria" },
    { "label": "Andorra" },
    { "label": "Angola" },
    { "label": "Antigua and Barbuda" },
    { "label": "Argentina" },
    { "label": "Armenia" },
    { "label": "Australia" },
    { "label": "Austria" },
    { "label": "Azerbaijan" },
    { "label": "Bahamas" },
    { "label": "Bahrain" },
    { "label": "Bangladesh" },
    { "label": "Barbados" },
    { "label": "Belarus" },
    { "label": "Belgium" },
    { "label": "Belize" },
    { "label": "Benin" },
    { "label": "Bhutan" },
    { "label": "Bolivia" },
    { "label": "Bosnia and Herzegovina" },
    { "label": "Botswana" },
    { "label": "Brazil" },
    { "label": "Brunei" },
    { "label": "Bulgaria" },
    { "label": "Burkina Faso" },
    { "label": "Burundi" },
    { "label": "Cabo Verde" },
    { "label": "Cambodia" },
    { "label": "Cameroon" },
    { "label": "Canada" },
    { "label": "Central African Republic" },
    { "label": "Chad" },
    { "label": "Chile" },
    { "label": "China" },
    { "label": "Colombia" },
    { "label": "Comoros" },
    { "label": "Congo, Democratic Republic of the" },
    { "label": "Congo, Republic of the" },
    { "label": "Costa Rica" },
    { "label": "Croatia" },
    { "label": "Cuba" },
    { "label": "Cyprus" },
    { "label": "Czech Republic" },
    { "label": "Denmark" },
    { "label": "Djibouti" },
    { "label": "Dominica" },
    { "label": "Dominican Republic" },
    { "label": "East Timor" },
    { "label": "Ecuador" },
    { "label": "Egypt" },
    { "label": "El Salvador" },
    { "label": "Equatorial Guinea" },
    { "label": "Eritrea" },
    { "label": "Estonia" },
    { "label": "Eswatini" },
    { "label": "Ethiopia" },
    { "label": "Fiji" },
    { "label": "Finland" },
    { "label": "France" },
    { "label": "Gabon" },
    { "label": "Gambia" },
    { "label": "Georgia" },
    { "label": "Germany" },
    { "label": "Ghana" },
    { "label": "Greece" },
    { "label": "Grenada" },
    { "label": "Guatemala" },
    { "label": "Guinea" },
    { "label": "Guinea-Bissau" },
    { "label": "Guyana" },
    { "label": "Haiti" },
    { "label": "Honduras" },
    { "label": "Hungary" },
    { "label": "Iceland" },
    { "label": "India" },
    { "label": "Indonesia" },
    { "label": "Iran" },
    { "label": "Iraq" },
    { "label": "Ireland" },
    { "label": "Israel" },
    { "label": "Italy" },
    { "label": "Ivory Coast" },
    { "label": "Jamaica" },
    { "label": "Japan" },
    { "label": "Jordan" },
    { "label": "Kazakhstan" },
    { "label": "Kenya" },
    { "label": "Kiribati" },
    { "label": "Korea, North" },
    { "label": "Korea, South" },
    { "label": "Kosovo" },
    { "label": "Kuwait" },
    { "label": "Kyrgyzstan" },
    { "label": "Laos" },
    { "label": "Latvia" },
    { "label": "Lebanon" },
    { "label": "Lesotho" },
    { "label": "Liberia" },
    { "label": "Libya" },
    { "label": "Liechtenstein" },
    { "label": "Lithuania" },
    { "label": "Luxembourg" },
    { "label": "Madagascar" },
    { "label": "Malawi" },
    { "label": "Malaysia" },
    { "label": "Maldives" },
    { "label": "Mali" },
    { "label": "Malta" },
    { "label": "Marshall Islands" },
    { "label": "Mauritania" },
    { "label": "Mauritius" },
    { "label": "Mexico" },
    { "label": "Micronesia" },
    { "label": "Moldova" },
    { "label": "Monaco" },
    { "label": "Mongolia" },
    { "label": "Montenegro" },
    { "label": "Morocco" },
    { "label": "Mozambique" },
    { "label": "Myanmar" },
    { "label": "Namibia" },
    { "label": "Nauru" },
    { "label": "Nepal" },
    { "label": "Netherlands" },
    { "label": "New Zealand" },
    { "label": "Nicaragua" },
    { "label": "Niger" },
    { "label": "Nigeria" },
    { "label": "North Macedonia" },
    { "label": "Norway" },
    { "label": "Oman" },
    { "label": "Pakistan" },
    { "label": "Palau" },
    { "label": "Panama" },
    { "label": "Papua New Guinea" },
    { "label": "Paraguay" },
    { "label": "Peru" },
    { "label": "Philippines" },
    { "label": "Poland" },
    { "label": "Portugal" },
    { "label": "Qatar" },
    { "label": "Romania" },
    { "label": "Russia" },
    { "label": "Rwanda" },
    { "label": "Saint Kitts and Nevis" },
    { "label": "Saint Lucia" },
    { "label": "Saint Vincent and the Grenadines" },
    { "label": "Samoa" },
    { "label": "San Marino" },
    { "label": "Sao Tome and Principe" },
    { "label": "Saudi Arabia" },
    { "label": "Senegal" },
    { "label": "Serbia" },
    { "label": "Seychelles" },
    { "label": "Sierra Leone" },
    { "label": "Singapore" },
    { "label": "Slovakia" },
    { "label": "Slovenia" },
    { "label": "Solomon Islands" },
    { "label": "Somalia" },
    { "label": "South Africa" },
    { "label": "South Sudan" },
    { "label": "Spain" },
    { "label": "Sri Lanka" },
    { "label": "Sudan" },
    { "label": "Suriname" },
    { "label": "Sweden" },
    { "label": "Switzerland" },
    { "label": "Syria" },
    { "label": "Taiwan" },
    { "label": "Tajikistan" },
    { "label": "Tanzania" },
    { "label": "Thailand" },
    { "label": "Togo" },
    { "label": "Tonga" },
    { "label": "Trinidad and Tobago" },
    { "label": "Tunisia" },
    { "label": "Turkey" },
    { "label": "Turkmenistan" },
    { "label": "Tuvalu" },
    { "label": "Uganda" },
    { "label": "Ukraine" },
    { "label": "United Arab Emirates" },
    { "label": "United Kingdom" },
    { "label": "United States" },
    { "label": "Uruguay" },
    { "label": "Uzbekistan" },
    { "label": "Vanuatu" },
    { "label": "Vatican City" },
    { "label": "Venezuela" },
    { "label": "Vietnam" },
    { "label": "Yemen" },
    { "label": "Zambia" },
    { "label": "Zimbabwe" }
  ]

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);

    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
      url: getUser(),
      data: {},
    }).then((response) => {
      if (response.data.data) {
        // alert(JSON.stringify(response.data.data))
        setState(response.data.data);
        setInputCountryValue(response.data.data.country);
      } else {
        alert(JSON.stringify(response.data.message));
      }
    });

    setLoading(false);
  }, []);

  const handleSubmit = (event) => {
    let choice = window.confirm('Are you sure you want to update your profile?');
    if (choice) {
      setLoading(true);
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
        url: updateUser(),
        data: state,
      }).then((response) => {
        alert(response.data.message);
        window.location.href = '/profile';
      });
    }
  };

  const handleChange = (event) => {
    event.persist();
    const { name, value } = event.target;

    setState({ ...state, [name]: value });
  };

  const handleCountryChange = (newValue) => {
    setState({ ...state, country: newValue });
  };
  const { fname, lname, email, country, skype, telegram } = state;

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
          <SimpleCard title="Add/Update Traffic Source">
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="fname"
                    label="First Name"
                    onChange={handleChange}
                    value={fname || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="text"
                    name="lname"
                    label="Last Name"
                    onChange={handleChange}
                    value={lname || ''}
                  />
                  <TextField
                    type="email"
                    name="email"
                    label="Email"
                    onChange={handleChange}
                    value={email || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <Autocomplete
                    id="country-selector"
                    options={countries}
                    value={countries.find(c => c.label === country) || null}
                    getOptionLabel={(option) => option.label}
                    getOptionSelected={(option, value) => option.label === value.label}
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      handleCountryChange(newValue ? newValue.label : '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        variant="outlined"
                        label="Country"
                        placeholder="Select a country"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="skype"
                    label="Skype"
                    onChange={handleChange}
                    value={skype || ''}
                  />
                  <TextField
                    type="text"
                    name="telegram"
                    label="Telegram"
                    onChange={handleChange}
                    value={telegram || ''}
                  />
                </Grid>
              </Grid>
              <Button color="success" variant="contained" type="submit">
                <Icon>send</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Save</Span>
              </Button>
            </ValidatorForm>
          </SimpleCard>
        </Container>
      )}
    </>
  );
};

export default AddUpdateTrafficSources;
