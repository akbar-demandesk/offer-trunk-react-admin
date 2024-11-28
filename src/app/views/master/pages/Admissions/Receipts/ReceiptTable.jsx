import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { SimpleCard } from 'app/components';
import { ValidatorForm } from 'react-material-ui-form-validator';

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
import { Autocomplete, TextField } from '@mui/material';
import { Span } from 'app/components/Typography';
import { getReceipts, generateReceipt } from 'app/helper/ApiUrlHelper';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const StyledTable = styled(Table)(() => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': { '& th': { paddingLeft: 0, paddingRight: 0 } },
  },
  '& tbody': {
    '& tr': { '& td': { paddingLeft: 0, textTransform: 'capitalize' } },
  },
}));

const ReceiptTable = () => {
  const [RowData, setRowData] = useState([]); // For Table
  const [DropDown, setDropDown] = useState([]); // For Filter
  const [masterFilter, setMasterFilter] = useState({ name: null, shop: null, street: null }); // For Filter
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Pagination
  const [loading, setLoading] = useState(false); // For Loader

  let navigation = useNavigate();
  let location = useLocation();
  let id = location?.state?.data || 0;
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken') },
      url: getReceipts(),
      data: { id: id },
    }).then((response) => {
      if (response.data.data) {
        setRowData(response.data.data);
        setDropDown(response.data.data);
      } else {
        alert(response.data.message);
      }
    });
    setLoading(false);
  }, []);

  // Pagination
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleGenerateReceipt = (id) => {
    setLoading(true);
    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken') },
      url: generateReceipt(),
      data: { id: id },
    }).then((response) => {
      // alert(response.data.message);
      setLoading(false);
      window.open('https://file.mukarram.in/PDF/bisme/RECEIPT.pdf');

      // if (response.data.data) {
      //   setRowData(response.data.data);
      // } else {
      // }
    });
  };

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
          <SimpleCard title="Actions">
            <ValidatorForm onError={() => null}>
              {/* <Grid container spacing={6}>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      width: 300,
                      '& > * + *': {
                        marginTop: theme.spacing(3),
                      },
                    }}
                  >
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={DropDown}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      onChange={(event, newValue) => {
                        let result = newValue.map((a) => a.name);
                        handleChange('name', result);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Name"
                          placeholder="Name"
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid> */}

              <Grid container spacing={6}>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Box>
                    <Button color="success" variant="contained">
                      <Icon>add</Icon>
                      <Span
                        onClick={(e) =>
                          navigation('/AddUpdateReceipt', {
                            state: { admission_id: location.state.data },
                          })
                        }
                      >
                        Add Receipt
                      </Span>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </ValidatorForm>
          </SimpleCard>
          <br></br>
          <SimpleCard title="Receipts">
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="Left">Receipt No</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Mode</TableCell>
                    <TableCell align="center">DOP</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                    (subscriber, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{subscriber.receipt_id}</TableCell>
                        <TableCell align="center">{subscriber.amount}</TableCell>
                        <TableCell align="center">
                          {(() => {
                            switch (subscriber.mode) {
                              case '0':
                                return 'Cash';
                              case '1':
                                return 'Cheque';
                              case '2':
                                return 'UPI';
                              case '3':
                                return 'Bank';
                              default:
                                return 'Unknown Mode';
                            }
                          })()}
                        </TableCell>

                        <TableCell align="center">
                          {new Date(subscriber.payment_date).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) =>
                              navigation('/AddUpdateReceipt', {
                                state: { admission_id: location.state.data, r_id: subscriber.id },
                              })
                            }
                          >
                            <Icon color="error">edit</Icon>
                          </IconButton>
                          <IconButton onClick={() => handleGenerateReceipt(subscriber.id)}>
                            <Icon color="dark">print</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </StyledTable>

              <TablePagination
                sx={{ px: 2 }}
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={RowData.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
                nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                backIconButtonProps={{ 'aria-label': 'Previous Page' }}
              />
            </Box>
          </SimpleCard>
        </Container>
      )}
    </>
  );
};

export default ReceiptTable;
