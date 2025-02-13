import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getAllNetworks, getNetworksByUser } from 'app/helper/ApiUrlHelper';

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
  { label: 'Rejected', value: 2 }
];

const NetworkTable = () => {
  const [RowData, setRowData] = useState([]); // For Table
  const [DropDown, setDropDown] = useState([]); // For Filter
  const [filteredData, setFilteredData] = useState([]); // For Filtered Table
  const [nameFilter, setNameFilter] = useState(null); // For Name Filter
  const [statusFilter, setStatusFilter] = useState(null); // For Status Filter
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const storedRows = localStorage.getItem('rowsPerPage');
    return storedRows ? parseInt(storedRows, 10) : 10;
  });
  const [loading, setLoading] = useState(false); // For Loader

  let navigation = useNavigate();
  let roleid = localStorage.getItem('roleId');
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    if (roleid == 1) {
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleId: localStorage.getItem('roleId') },
        url: getNetworksByUser(),
        data: null,
      }).then((response) => {
        console.log(response);
        if (response.data.errorCode == 0) {
          setRowData(response.data.data);
          setDropDown(response.data.data);
          setFilteredData(response.data.data);
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
        headers: { token: localStorage.getItem('accessToken'), roleId: localStorage.getItem('roleId') },
        url: getAllNetworks(),
        data: null,
      }).then((response) => {
        if (response.data.errorCode == 0) {
          setRowData(response.data.data);
          setDropDown(response.data.data);
          setFilteredData(response.data.data);
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
  }, [roleid]);

  const handleNameFilterChange = (event, value) => {
    setNameFilter(value);
    filterData(value, statusFilter);
  };

  const handleStatusFilterChange = (event, value) => {
    setStatusFilter(value);
    filterData(nameFilter, value);
  };

  const filterData = (nameFilter, statusFilter) => {
    const filtered = RowData.filter(item => {
      const nameMatch = nameFilter ? item.name.includes(nameFilter.name) : true;
      const statusMatch = statusFilter ? item.status === statusFilter.value : true;
      return nameMatch && statusMatch;
    });
    setFilteredData(filtered);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    localStorage.setItem('rowsPerPage', +event.target.value);
    setPage(0);
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
                      id="name-filter"
                      options={DropDown}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      onChange={handleNameFilterChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Filter by Name"
                          placeholder="Name"
                          fullWidth
                        />
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

              <Grid container spacing={6}>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Box>
                    <Button color="success" variant="contained">
                      <Icon>add</Icon>
                      <Span onClick={() => navigation('/AddUpdateNetwork', { state: null })}>
                        Add Network
                      </Span>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Box>
                    <Button color="success" variant="contained">
                      <Icon>add</Icon>
                      <Span onClick={() => navigation('/AddUpdateOffer', { state: null })}>
                        Add Offer
                      </Span>
                    </Button>
                  </Box>
                </Grid>
              </Grid>

            </ValidatorForm>
          </SimpleCard>
          <br></br>
          <SimpleCard title="Networks">
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="Left">Id</TableCell>
                    <TableCell align="Left">Name</TableCell>
                    <TableCell align="left">URL</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                    (subscriber, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{subscriber.id}</TableCell>
                        <TableCell align="left">{subscriber.name}</TableCell>
                        <TableCell align="left" style={{ textTransform: 'none' }}>{subscriber.url}</TableCell>
                        <TableCell align="center" style={{ color: getStatusColor(subscriber.status) }}>
                          {getStatusLabel(subscriber.status)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() =>
                              navigation('/AddUpdateNetwork', {
                                state: { data: subscriber.id },
                              })
                            }
                          >
                            <Icon color="error">edit</Icon>
                          </IconButton>
                          {
                            roleid != 2 && (<>
                              <IconButton
                                onClick={() =>
                                  navigation('/offer', {
                                    state: { data: subscriber.id, name: subscriber.name },
                                  })
                                }
                              >
                                <Icon color="primary">movie_ticket</Icon>
                              </IconButton>
                            </>)
                          }

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
                count={filteredData.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25, 50]}
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

export default NetworkTable;
