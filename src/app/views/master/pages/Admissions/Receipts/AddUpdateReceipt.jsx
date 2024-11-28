import React, { useEffect, useState } from 'react';
import { SimpleCard } from 'app/components';
import CircularProgress from '@mui/material/CircularProgress';
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
import {
  addUpdateAdmission,
  addUpdateReceipt,
  addUpdateStudent,
  getAdmission,
  getCourses,
  getReceipt,
  getStudent,
  getStudents,
} from 'app/helper/ApiUrlHelper';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Autocomplete } from '@mui/material';

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

const AddUpdateReceipt = () => {
  let location = useLocation();
  let admission_id = location?.state?.admission_id || 0;

  const [state, setState] = useState({ admission_id: admission_id, mode: 0 });
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    if (!location.state.admission_id) {
      window.location.href = '/admissions';
    }
    // alert(location.state.admission_id);
    if (location?.state?.r_id) {
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken') },
        url: getReceipt(),
        data: { id: location.state.r_id },
      }).then((response) => {
        if (response.data.data) {
          setState(response.data.data);
        } else {
          alert(response.data.message);
        }
      });
    }
    setLoading(false);
  }, []);

  const handleSubmit = (event) => {
    let choice = window.confirm('Please confirm the receipt for this admission?');
    if (choice) {
      setLoading(true);
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken') },
        url: addUpdateReceipt(),
        data: state,
      }).then((response) => {
        alert(response.data.message);
        if (response.data.errorCode == 0) {
          window.location.href = '/admissions';
        }
      });
    }

    // alert(JSON.stringify(state));
  };

  const handleChange = (event) => {
    event.persist();
    const { name, value } = event.target;

    setState({ ...state, [name]: value });
  };
  const handleAdmissionDateChange = (date) => {
    const formattedDate = date.toISOString().substring(0, 10);
    setState({ ...state, payment_date: formattedDate });
  };
  const handleModeChange = (value) => {
    setState({ ...state, mode: value });
  };

  const {
    receipt_id,
    amount,
    mode,
    upi_number,
    transaction_id,
    client_name,
    bank_name,
    ifsc,
    payment_date,
    remarks,
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
          <SimpleCard title="Add/Update Receipt">
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="number"
                    name="receipt_id"
                    label="Receipt No"
                    onChange={handleChange}
                    value={receipt_id || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="number"
                    name="amount"
                    label="Amount"
                    onChange={handleChange}
                    value={amount || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={payment_date || ''}
                      format="dd/MM/YYYY"
                      onChange={handleAdmissionDateChange}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          label="Payment Date"
                          id="mui-pickers-date"
                          sx={{ mb: 2, width: '100%' }}
                        />
                      )}
                      inputFormat="dd/MM/yyyy"
                    />
                  </LocalizationProvider>
                  <Autocomplete
                    id="tags-outlined"
                    options={[
                      { status: 0, label: 'Cash' },
                      { status: 1, label: 'Cheque' },
                      { status: 2, label: 'UPI' },
                      { status: 3, label: 'Bank' },
                    ]}
                    getOptionLabel={(option) => option.label}
                    filterSelectedOptions
                    value={
                      mode == 3
                        ? { status: 3, label: 'Bank' }
                        : mode == 1
                        ? { status: 1, label: 'Cheque' }
                        : mode == 2
                        ? { status: 2, label: 'UPI' }
                        : { status: 0, label: 'Cash' }
                    }
                    onChange={(event, newValue) => {
                      if (newValue) handleModeChange(newValue.status);
                      else handleModeChange(0);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        variant="outlined"
                        label="Mode Of Payment"
                        placeholder="Mode Of Payment"
                        fullWidth
                      />
                    )}
                  />
                  <TextField
                    type="text"
                    name="remarks"
                    label="Remarks"
                    onChange={handleChange}
                    value={remarks || ''}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  {mode == 2 && (
                    <TextField
                      type="text"
                      name="upi_number"
                      label="UPI Number"
                      onChange={handleChange}
                      value={upi_number || ''}
                    />
                  )}
                  {(mode == 1 || mode == 2 || mode == 3) && (
                    <>
                      <TextField
                        type="text"
                        name="transaction_id"
                        label="Transaction Id"
                        onChange={handleChange}
                        value={transaction_id || ''}
                      />
                    </>
                  )}
                  {mode == 3 && (
                    <>
                      <TextField
                        type="text"
                        name="bank_name"
                        label="Bank Name"
                        onChange={handleChange}
                        value={bank_name || ''}
                      />
                      <TextField
                        type="text"
                        name="ifsc"
                        label="IFSC"
                        onChange={handleChange}
                        value={ifsc || ''}
                      />
                      <TextField
                        type="text"
                        name="client_name"
                        label="Client Name"
                        onChange={handleChange}
                        value={client_name || ''}
                      />
                    </>
                  )}
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

export default AddUpdateReceipt;
