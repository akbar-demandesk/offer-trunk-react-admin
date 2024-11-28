import { styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SimpleCard } from 'app/components';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Box, Grid, Icon, Button, useTheme } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { Span } from 'app/components/Typography';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker } from '@mui/lab';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';
import { generateReceiptsTB, generateRentTB } from 'app/helper/ApiUrlHelper';
import { generateDonationTB } from 'app/helper/ApiUrlHelper';
import { generateRentBill } from 'app/helper/ApiUrlHelper';
import { generateDonationBill } from 'app/helper/ApiUrlHelper';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));
const RentStatement = () => {
  const theme = useTheme();
  let [fromDate, setFromDate] = useState();
  let [toDate, setToDate] = useState();
  let [data, setData] = useState();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);

  // Change
  const handleFromDateChange = (date) => {
    setFromDate(date);
    var newFromDate = moment(date).format('YYYY-MM-DD');
    var newToDate = moment(toDate).format('YYYY-MM-DD');
    setData({ fromDate: newFromDate, toDate: newToDate });
  };
  const handleToDateChange = (date) => {
    setToDate(date);
    var newFromDate = moment(fromDate).format('YYYY-MM-DD');
    var newToDate = moment(date).format('YYYY-MM-DD');
    setData({ fromDate: newFromDate, toDate: newToDate });
  };

  // Statement
  const handleRentTB = (type) => {
    setLoading(true);
    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken') },
      url: generateReceiptsTB(),
      data: {
        type: type,
        fromPeriod: data.fromDate,
        toPeriod: data.toDate,
      },
    }).then((response) => {
      if (response.data.errorCode == 0) {
        if (type == 1) window.open('https://file.mukarram.in/PDF/bisme/UNPAID_TB.pdf');
        else window.open('https://file.mukarram.in/PDF/bisme/PAID_TB.pdf');
        setLoading(false);
      } else {
        alert(response.data.message);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    setData({
      fromDate: moment(fromDate).format('YYYY-MM-DD'),
      toDate: moment(toDate).format('YYYY-MM-DD'),
    });
  }, []);

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
          <SimpleCard title="Statement">
            <Grid container spacing={6}>
              <Grid item lg={6} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                <Box
                  sx={{
                    width: 500,
                    '& > * + *': {
                      marginTop: theme.spacing(3),
                    },
                  }}
                >
                  <ValidatorForm onSubmit={() => {}} onError={() => null}>
                    <Grid container spacing={6}>
                      <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                        <Box
                          sx={{
                            width: 350,
                            '& > * + *': {
                              marginTop: theme.spacing(3),
                            },
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={fromDate}
                              onChange={handleFromDateChange}
                              inputFormat="dd/MM/yyyy"
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  label="From Date"
                                  id="mui-pickers-date"
                                  sx={{ mb: 2, width: '100%' }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                        <Box
                          sx={{
                            width: 350,
                            '& > * + *': {
                              marginTop: theme.spacing(3),
                            },
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              value={toDate}
                              onChange={handleToDateChange}
                              inputFormat="dd/MM/yyyy"
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  label="To Date"
                                  id="mui-pickers-date"
                                  sx={{ mb: 2, width: '100%' }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6}>
                      <Grid item lg={4} md={2} sm={12} xs={12} sx={{ mt: 2 }}>
                        <Box>
                          <Button
                            color="success"
                            variant="contained"
                            onClick={(e) => handleRentTB(0)}
                          >
                            <Icon>print</Icon>
                            <Span>Paid</Span>
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item lg={4} md={2} sm={12} xs={12} sx={{ mt: 2 }}>
                        <Box>
                          <Button
                            color="success"
                            variant="contained"
                            onClick={(e) => handleRentTB(1)}
                          >
                            <Icon>print</Icon>
                            <Span>Unpaid</Span>
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </ValidatorForm>
                </Box>
              </Grid>
            </Grid>
          </SimpleCard>
        </Container>
      )}{' '}
    </>
  );
};

export default RentStatement;
