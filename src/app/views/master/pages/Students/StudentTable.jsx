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
import { getStudents } from 'app/helper/ApiUrlHelper';

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

const StudentTable = () => {
  const [RowData, setRowData] = useState([]); // For Table
  const [DropDown, setDropDown] = useState([]); // For Filter
  const [masterFilter, setMasterFilter] = useState({ name: null, shop: null, street: null }); // For Filter
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Pagination
  const [loading, setLoading] = useState(false); // For Loader

  let navigation = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken') },
      url: getStudents(),
      data: masterFilter,
    }).then((response) => {
      if (response.data.data) {
        setRowData(response.data.data);
        setDropDown(response.data.data);
      } else {
        alert(response.data.message);
      }
      setLoading(false);
    });
  }, []);

  // Pagination
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
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
                      <Span onClick={(e) => navigation('/AddUpdateStudent', { state: null })}>
                        Add Student
                      </Span>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </ValidatorForm>
          </SimpleCard>
          <br></br>
          <SimpleCard title="Students">
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="Left">Id</TableCell>
                    <TableCell align="Left">Name</TableCell>
                    <TableCell align="center">DOB</TableCell>
                    <TableCell align="center">Number / Email</TableCell>
                    <TableCell align="center">DOS</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                    (subscriber, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{subscriber.id}</TableCell>
                        <TableCell align="left">{subscriber.name}</TableCell>
                        <TableCell align="center">
                          {' '}
                          {new Date(subscriber.dob).toLocaleDateString('en-GB')}
                        </TableCell>
                        <TableCell align="center">
                          {subscriber.student_number} / {subscriber.email}
                        </TableCell>
                        <TableCell align="center">
                          {subscriber.domain_of_study === 0 ? 'School' : 'College'}
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            onClick={(e) =>
                              navigation('/AddUpdateStudent', {
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

export default StudentTable;
