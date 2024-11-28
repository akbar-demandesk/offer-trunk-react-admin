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
import { getAllTrafficSource, getTrafficSources } from 'app/helper/ApiUrlHelper';

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

const statuses = [
  { value: 0, label: 'Unapproved', color: 'black' },
  { value: 1, label: 'Approved', color: 'green' },
  { value: 2, label: 'Rejected', color: 'red' },
];

const TrafficSourcesTable = () => {
  const [RowData, setRowData] = useState([]); // For Table
  const [OriginalRowData, setOriginalRowData] = useState([]); // For Original Data
  const [DropDown, setDropDown] = useState([]); // For Filter
  const [masterFilter, setMasterFilter] = useState(); // For Filter
  const [statusFilter, setStatusFilter] = useState([]); // For Status Filter
  const [nameFilter, setNameFilter] = useState([]); // For Name Filter
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Pagination
  const [loading, setLoading] = useState(false); // For Loader

  let navigation = useNavigate();
  let roleid = localStorage.getItem('roleId');
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = roleid == 1 ?
          await axios.post(getTrafficSources(), null, { headers: { token: localStorage.getItem('accessToken'), roleId: localStorage.getItem('roleId') } }) :
          await axios.post(getAllTrafficSource(), null, { headers: { token: localStorage.getItem('accessToken'), roleId: localStorage.getItem('roleId') } });

        if (response.data.data) {
          setRowData(response.data.data);
          setOriginalRowData(response.data.data);
          setDropDown(response.data.data);
        } else {
          const message = response.data.message;
          alert(message);
          if (["Invalid Token 1", "Invalid Token 2", "Invalid Token 3"].includes(message)) {
            // Redirect to /session/signin
            window.location.href = '/session/signin';
          }
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roleid]);

  // Get unique names for name filter
  const uniqueNames = [...new Set(OriginalRowData.map(item => item.name))].map(name => ({ label: name }));

  // Pagination
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Filter by status
  const handleStatusFilterChange = (event, newValue) => {
    setStatusFilter(newValue);
    filterData(newValue, nameFilter);
  };

  // Filter by name
  const handleNameFilterChange = (event, newValue) => {
    setNameFilter(newValue);
    filterData(statusFilter, newValue);
  };

  // Combined filter function
  const filterData = (statusFilter, nameFilter) => {
    let filteredData = OriginalRowData;

    if (statusFilter.length > 0) {
      filteredData = filteredData.filter(row => statusFilter.some(status => status.value === row.status));
    }

    if (nameFilter.length > 0) {
      filteredData = filteredData.filter(row => nameFilter.some(name => name.label === row.name));
    }

    setRowData(filteredData);
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
                  <Box>
                    <Autocomplete
                      multiple
                      id="status-filter"
                      options={statuses}
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
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Box>
                    <Autocomplete
                      multiple
                      id="name-filter"
                      options={uniqueNames}
                      getOptionLabel={(option) => option.label}
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
              </Grid>

              <Grid container spacing={6}>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Box>
                    <Button color="success" variant="contained">
                      <Icon>add</Icon>
                      <Span onClick={(e) => navigation('/AddUpdateTrafficSources', { state: null })}>
                        Add Traffic Source
                      </Span>
                    </Button>
                  </Box>
                </Grid>
              </Grid>

            </ValidatorForm>
          </SimpleCard>
          <br></br>
          <SimpleCard title="Traffic Sources">
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="Left">Id</TableCell>
                    <TableCell align="Left">Name</TableCell>
                    <TableCell align="Left">Type</TableCell>
                    <TableCell align="left">Url</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                    (subscriber, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{subscriber.id}</TableCell>
                        <TableCell align="left">{subscriber.name}</TableCell>
                        <TableCell align="left">{subscriber.type}</TableCell>
                        <TableCell align="center" style={{ textTransform: 'none' }}>{subscriber.url}</TableCell>
                        <TableCell align="center">
                          {subscriber.status === 0 ? (
                            <span style={{ color: 'black' }}>Unapproved</span>
                          ) : subscriber.status === 1 ? (
                            <span style={{ color: 'green' }}>Approved</span>
                          ) : (
                            <span style={{ color: 'red' }}>Rejected</span>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) =>
                              navigation('/AddUpdateTrafficSources', {
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

export default TrafficSourcesTable;
