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
  TextField as MuiTextField,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextareaAutosize,
} from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Span } from 'app/components/Typography';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { Autocomplete } from '@mui/material';
import { addUpdateTrafficSource, getTrafficSource, deleteTraffic } from 'app/helper/ApiUrlHelper';

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
  let roleid = parseInt(localStorage.getItem('roleId'));

  const [state, setState] = useState({ id: id });
  const [loading, setLoading] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [status, setStatus] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // New state for confirmation dialog
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState(false); // New state for remarks validation

  const theme = useTheme();

  const options = [
    { id: 0, name: 'No' },
    { id: 1, name: 'Yes' }
  ];

  const statusOptions = [
    { label: 'Unapproved', value: 0 },
    { label: 'Approve', value: 1 },
    { label: 'Reject', value: 2 }
  ];

  useEffect(() => {
    setLoading(true);
    if (location?.state?.data) {
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleId: localStorage.getItem('roleId') },
        url: getTrafficSource(),
        data: { id: id },
      }).then((response) => {
        if (response.data.errorCode == 0) {
          setState(response.data.data);
          setStatus(response.data.data.status);
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
      });
    }
    setLoading(false);
  }, [id, location?.state?.data]);

  const handleSubmit = (event) => {
    let choice = window.confirm('Are you sure you want to add this Traffic Source?');
    if (choice) {
      setLoading(true);
      const formData = new FormData();
      for (const key in state) {
        formData.append(key, state[key]);
      }
      formData.set('status', status);
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleId: localStorage.getItem('roleId') },
        url: addUpdateTrafficSource(),
        data: formData,
      }).then((response) => {
        if (response.data.errorCode == 0) {
          alert(response.data.message);
          window.location.href = '/traffic-sources';
        }
        else {
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
  };

  const handleDelete = () => {
    if (roleid === 2) {
      setDeleteDialogOpen(true);
    } else {
      setConfirmationDialogOpen(true); // Open confirmation dialog for other roles
    }
  };

  const confirmDelete = () => {
    deleteTrafficSourceRequest(null);
    setConfirmationDialogOpen(false); // Close confirmation dialog
  };

  const deleteTrafficSourceRequest = (remarks) => {
    setLoading(true);
    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken'), roleId: localStorage.getItem('roleId') },
      url: deleteTraffic(),
      data: { id: id, remarks: remarks },
    }).then((response) => {
      alert(response.data.message);
      setLoading(false);
      if (response.data.errorCode == 0) {
        window.location.href = '/traffic-sources';
      }
      else {
        const message = response.data.message;
        if (["Invalid Token 1", "Invalid Token 2", "Invalid Token 3"].includes(message)) {
          alert("Session Expired, please relogin");
          // Redirect to /session/signin
          window.location.href = '/session/signin';
        } else {
          alert(message);
        }
      }
    });
  };

  const handleChange = (event) => {
    event.persist();
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleAutoCompleteChange = (key, newValue) => {
    setState({ ...state, [key]: newValue });
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const imageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      if (allowedExtensions.includes(fileExtension)) {
        setState({
          ...state,
          img: selectedFile,
        });
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

  const handleDeleteDialogClose = (confirm) => {
    if (confirm) {
      if (!remarks || remarks.trim() === '') {
        setRemarksError(true);
      } else {
        setRemarksError(false);
        setDeleteDialogOpen(false);
        deleteTrafficSourceRequest(remarks);
      }
    } else {
      setDeleteDialogOpen(false);
    }
  };

  const { name, description, type, mobile, desktop, retargeting, self_serve, managed, url, img } = state;

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
                    name="name"
                    label="Name"
                    onChange={handleChange}
                    value={name || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="text"
                    name="description"
                    label="Description"
                    onChange={handleChange}
                    value={description || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="text"
                    name="type"
                    label="Type"
                    onChange={handleChange}
                    value={type || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="text"
                    name="url"
                    label="URL"
                    onChange={handleChange}
                    value={url || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <Autocomplete
                    id="mobile-outlined" sx={{ mb: 2 }}
                    options={options}
                    value={options.find(option => option.id === mobile) || null}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      handleAutoCompleteChange('mobile', newValue ? newValue.id : null);
                    }}
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        variant="outlined"
                        label="Mobile"
                        placeholder="Mobile"
                        fullWidth
                      />
                    )}
                  />
                  {!id ? (
                    <>
                      <label>Traffic Image(50x50): </label>
                      <TextField type="file" name="img" onChange={imageUpload} />
                    </>
                  ) : (
                    <>
                      {!editImage && (
                        <>
                          <Button color="warning" variant="contained" onClick={handleImageChange}>
                            <Icon>edit</Icon>
                            <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Update Image</Span>
                          </Button>
                          <br />
                          <br />
                        </>
                      )}
                    </>
                  )}
                  {editImage && (
                    <>
                      <label>Traffic Image(50x50): </label>
                      <TextField type="file" name="img" onChange={imageUpload} />
                    </>
                  )}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Autocomplete sx={{ mb: 2 }}
                    id="managed-outlined"
                    options={options}
                    value={options.find(option => option.id === managed) || null}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      handleAutoCompleteChange('managed', newValue ? newValue.id : null);
                    }}
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        variant="outlined"
                        label="Managed"
                        placeholder="Managed"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete sx={{ mb: 2 }}
                    id="retargeting-outlined"
                    options={options}
                    value={options.find(option => option.id === retargeting) || null}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      handleAutoCompleteChange('retargeting', newValue ? newValue.id : null);
                    }}
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        variant="outlined"
                        label="Retargeting"
                        placeholder="Retargeting"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete sx={{ mb: 2 }}
                    id="self_serve-outlined"
                    options={options}
                    value={options.find(option => option.id === self_serve) || null}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      handleAutoCompleteChange('self_serve', newValue ? newValue.id : null);
                    }}
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        variant="outlined"
                        label="Self-Serve"
                        placeholder="Self-Serve"
                        fullWidth
                      />
                    )}
                  />
                  <Autocomplete sx={{ mb: 2 }}
                    id="desktop-outlined"
                    options={options}
                    value={options.find(option => option.id === desktop) || null}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      handleAutoCompleteChange('desktop', newValue ? newValue.id : null);
                    }}
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        variant="outlined"
                        label="Desktop"
                        placeholder="Desktop"
                        fullWidth
                      />
                    )}
                  />

                  {roleid === 2 && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Select
                        value={status}
                        onChange={handleStatusChange}
                        displayEmpty
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
              </Grid>
              <Button color="success" variant="contained" type="submit">
                <Icon>send</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Save</Span>
              </Button>

              {/* Render Delete Button only when id is not 0 */}
              {id != 0 && (
                <Button color="error" variant="contained" onClick={handleDelete} sx={{ ml: 2 }}>
                  <Icon>delete</Icon>
                  <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Delete</Span>
                </Button>
              )}
            </ValidatorForm>
          </SimpleCard>

          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => handleDeleteDialogClose(false)}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Delete Traffic Source</DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete this Traffic Source? Please provide remarks if any.
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

          {/* Confirmation dialog for non-role 2 */}
          <Dialog
            open={confirmationDialogOpen}
            onClose={() => setConfirmationDialogOpen(false)}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
          >
            <DialogTitle id="confirmation-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText id="confirmation-dialog-description">
                Are you sure you want to delete this Traffic Source?
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

export default AddUpdateTrafficSources;
