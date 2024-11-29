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
  MenuItem,
  FormControl,
  Select,
  Autocomplete,
  TextField,
} from '@mui/material';
import { Span } from 'app/components/Typography';
import { getAllOffers, getOffers } from 'app/helper/ApiUrlHelper';

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

const statusOptions = [
  { label: 'Approved', value: 1 },
  { label: 'Unapproved', value: 0 },
  { label: 'Rejected', value: 2 },
];

const OfferTable = () => {
  let location = useLocation();
  let id = location?.state?.data || 0;
  let name;

  if (location?.state?.name)
    name = location?.state?.name + " - Offers";
  else name = "Offers"

  const [RowData, setRowData] = useState([]); // For Table
  const [DropDown, setDropDown] = useState([]); // For Filter
  const [statusFilter, setStatusFilter] = useState(null); // Status Filter
  const [nameFilter, setNameFilter] = useState([]); // Name Filter
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Pagination
  const [loading, setLoading] = useState(false); // For Loader

  let navigation = useNavigate();
  let roleid = localStorage.getItem('roleId');
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    if (roleid == 1) {
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
        url: getOffers(),
        data: { network_id: id },
      }).then((response) => {
        if (response.data.errorCode == 0) {
          setRowData(response.data.data);
          setDropDown(response.data.data);
        } else {
          const message = response.data.message;
          if (["Invalid Token 1", "Invalid Token 2", "Invalid Token 3"].includes(message)) {
            alert("Session Expired, please relogin");
            // Redirect to /session/signin
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
        setLoading(false);
      });
    } else {
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
        url: getAllOffers(),
        data: {},
      }).then((response) => {
        if (response.data.errorCode == 0) {
          setRowData(response.data.data);
          setDropDown(response.data.data);
        } else {
          const message = response.data.message;
          if (["Invalid Token 1", "Invalid Token 2", "Invalid Token 3"].includes(message)) {
            alert("Session Expired, please relogin");
            // Redirect to /session/signin
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
        setLoading(false);
      });
    }
  }, []);

  // Pagination
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Status Filter Change
  const handleStatusFilterChange = (_, value) => {
    setStatusFilter(value);
  };

  // Name Filter Change
  const handleNameFilterChange = (_, value) => {
    setNameFilter(value);
  };

  // Filter RowData based on status and name
  const filteredRowData = RowData.filter((row) => {
    const statusMatch = statusFilter ? row.status === statusFilter.value : true;
    const nameMatch = nameFilter.length > 0
      ? nameFilter.some((filter) => row.name.toLowerCase().includes(filter.toLowerCase()))
      : true;
    return statusMatch && nameMatch;
  });

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
              <Grid container spacing={6}>
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
                      options={DropDown.map((option) => option.name)}
                      value={nameFilter}
                      onChange={handleNameFilterChange}
                      renderInput={(params) => (
                        <TextField {...params} label="Filter by Name" variant="outlined" />
                      )}
                    />
                  </Box>
                </Grid>
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
                      id="status-filter"
                      options={statusOptions}
                      getOptionLabel={(option) => option.label}
                      filterSelectedOptions
                      onChange={handleStatusFilterChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Filter by Status"
                          placeholder="Status"
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                </Grid>


              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                <Box>
                  <Button color="success" variant="contained">
                    <Icon>add</Icon>
                    <Span onClick={(e) => navigation('/AddUpdateOffer', { state: null })}>
                      Add Offer
                    </Span>
                  </Button>
                </Box>
              </Grid>
            </ValidatorForm>
          </SimpleCard>
          <br></br>
          <SimpleCard title={name}>
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="Left">Id</TableCell>
                    <TableCell align="Left">Name</TableCell>
                    {roleid == 2 && (<>
                      <TableCell align="Left">Network</TableCell>
                    </>)}
                    <TableCell align="left">URL</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                    (subscriber, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{subscriber.id}</TableCell>
                        <TableCell align="left">{subscriber.name}</TableCell>
                        {roleid == 2 && (<>
                          <TableCell align="Left">{subscriber.network_name}</TableCell>
                        </>)}
                        <TableCell align="left">{subscriber.offer_link}</TableCell>
                        <TableCell align="center" style={{ color: getStatusColor(subscriber.status) }}>
                          {getStatusLabel(subscriber.status)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) =>
                              navigation('/AddUpdateOffer', {
                                state: { data: subscriber.id },
                              })
                            }
                          >
                            <Icon color="error">edit</Icon>
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
                count={filteredRowData.length}
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

const getStatusColor = (status) => {
  switch (status) {
    case 0:
      return 'black';
    case 1:
      return 'green';
    case 2:
      return 'red';
    default:
      return 'black';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return 'Unapproved';
    case 1:
      return 'Approved';
    case 2:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

export default OfferTable;
