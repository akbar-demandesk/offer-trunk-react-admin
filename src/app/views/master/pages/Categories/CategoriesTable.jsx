import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { SimpleCard } from 'app/components';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

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
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Span } from 'app/components/Typography';
import { getCategories, createUpdateCategory, deleteCategory } from 'app/helper/ApiUrlHelper'; // Import deleteCategory

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

const CategoriesTable = () => {
  const location = useLocation();
  const id = location?.state?.data || 0;
  let name;

  if (location?.state?.name) name = location?.state?.name + ' - Categories';
  else name = 'Categories';

  const [RowData, setRowData] = useState([]); // For Table
  const [DropDown, setDropDown] = useState([]); // For Filter
  const [nameFilter, setNameFilter] = useState([]); // Name Filter
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Pagination
  const [loading, setLoading] = useState(false); // For Loader

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // null for add, category object for edit
  const [categoryName, setCategoryName] = useState('');
  const [dialogLoading, setDialogLoading] = useState(false);

  // Delete Confirmation Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const navigate = useNavigate();
  const roleid = localStorage.getItem('roleId');
  const theme = useTheme();

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    axios({
      method: 'post',
      headers: {
        token: localStorage.getItem('accessToken'),
        roleid: localStorage.getItem('roleId'),
      },
      url: getCategories(),
      data: {}, // No body data as per requirement
    })
      .then((response) => {
        if (response.data.errorCode === 0) {
          setRowData(response.data.data);
          setDropDown(response.data.data);
        } else {
          const message = response.data.message;
          if (
            ['Invalid Token 1', 'Invalid Token 2', 'Invalid Token 3'].includes(message)
          ) {
            alert('Session Expired, please relogin');
            // Redirect to /session/signin
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        alert('An error occurred while fetching categories.');
        setLoading(false);
      });
  };

  // Pagination Handlers
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Name Filter Change
  const handleNameFilterChange = (_, value) => {
    setNameFilter(value);
  };

  // Filter RowData based on name
  const filteredRowData = RowData.filter((row) => {
    const nameMatch =
      nameFilter.length > 0
        ? nameFilter.some((filter) =>
          row.name.toLowerCase().includes(filter.toLowerCase())
        )
        : true;
    return nameMatch;
  });

  // Dialog Handlers for Add/Edit
  const handleOpenAddDialog = () => {
    setCurrentCategory(null);
    setCategoryName('');
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory(null);
    setCategoryName('');
  };

  const handleDialogSubmit = () => {
    // Validate categoryName is not empty
    if (!categoryName.trim()) {
      alert('Category name cannot be empty.');
      return;
    }

    setDialogLoading(true);

    const payload = currentCategory
      ? { id: currentCategory.id, name: categoryName.trim() } // For update
      : { name: categoryName.trim() }; // For create

    axios({
      method: 'post',
      headers: {
        token: localStorage.getItem('accessToken'),
        roleid: localStorage.getItem('roleId'),
      },
      url: createUpdateCategory(),
      data: payload,
    })
      .then((response) => {
        if (response.data.errorCode === 0) {
          alert(
            currentCategory ? 'Category updated successfully.' : 'Category created successfully.'
          );
          fetchCategories(); // Refresh the categories list
          handleCloseDialog();
        } else {
          const message = response.data.message;
          if (
            ['Invalid Token 1', 'Invalid Token 2', 'Invalid Token 3'].includes(message)
          ) {
            alert('Session Expired, please relogin');
            // Redirect to /session/signin
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
        setDialogLoading(false);
      })
      .catch((error) => {
        console.error('Error creating/updating category:', error);
        alert('An error occurred while creating/updating the category.');
        setDialogLoading(false);
      });
  };

  // Delete Dialog Handlers
  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = () => {
    if (!categoryToDelete) {
      alert('No category selected for deletion.');
      return;
    }

    setDialogLoading(true); // Reusing dialogLoading for delete operation

    axios({
      method: 'post', // Assuming deleteCategory uses POST; change to 'delete' if necessary
      headers: {
        token: localStorage.getItem('accessToken'),
        roleid: localStorage.getItem('roleId'),
      },
      url: deleteCategory(),
      data: { id: categoryToDelete.id }, // Assuming the API expects { id: ... } in the body
    })
      .then((response) => {
        if (response.data.errorCode === 0) {
          alert('Category deleted successfully.');
          fetchCategories(); // Refresh the categories list
          handleCloseDeleteDialog();
        } else {
          const message = response.data.message;
          if (
            ['Invalid Token 1', 'Invalid Token 2', 'Invalid Token 3'].includes(message)
          ) {
            alert('Session Expired, please relogin');
            // Redirect to /session/signin
            window.location.href = '/session/signin';
          } else {
            alert(message);
          }
        }
        setDialogLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
        alert('An error occurred while deleting the category.');
        setDialogLoading(false);
      });
  };

  // Helper Function to Format Date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Replace space with 'T' to make it ISO 8601 compliant
    const isoDateString = dateString.replace(' ', 'T');
    const date = new Date(isoDateString);
    if (isNaN(date)) return 'Invalid Date';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
        >
          <CircularProgress />
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


              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                <Box>
                  <Button
                    color="success"
                    variant="contained"
                    onClick={handleOpenAddDialog} // Open dialog on click
                  >
                    <Icon>add</Icon>
                    <Span >Add Category</Span>
                  </Button>
                </Box>
              </Grid>
            </ValidatorForm>
          </SimpleCard>
          <br />
          <SimpleCard title={name}>
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Id</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Created At</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRowData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{category.id}</TableCell>
                        <TableCell align="left">{category.name}</TableCell>
                        <TableCell align="left">{formatDate(category.created_at)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleOpenEditDialog(category)} // Open edit dialog
                            color="primary"
                          >
                            <Icon>edit</Icon>
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpenDeleteDialog(category)} // Open delete confirmation dialog
                            color="error"
                          >
                            <Icon>delete</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
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

      {/* Dialog for Add/Edit Category */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{currentCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <ValidatorForm onSubmit={handleDialogSubmit} onError={() => null}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextValidator
                  label="Category Name"
                  fullWidth
                  variant="outlined"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  validators={['required']}
                  errorMessages={['This field is required']}
                />
              </Grid>
            </Grid>
          </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary" disabled={dialogLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDialogSubmit}
            color="primary"
            variant="contained"
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Box>
            Are you sure you want to delete the category{' '}
            <strong>{categoryToDelete ? categoryToDelete.name : ''}</strong>?
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary" disabled={dialogLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCategory}
            color="error"
            variant="contained"
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default CategoriesTable;
