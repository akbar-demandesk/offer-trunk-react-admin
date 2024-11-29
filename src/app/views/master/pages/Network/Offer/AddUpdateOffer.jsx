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
import { addUpdateOffer, deleteOffer, getAllNetworks, getNetworksByUser, getOffer } from 'app/helper/ApiUrlHelper';

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const TextField = styled(TextValidator)(({ theme, readOnly }) => ({
  width: '100%',
  marginBottom: '16px',
  ...(readOnly && {
    backgroundColor: theme.palette.action.disabledBackground,
  }),
}));

const statusOptions = [
  { label: 'Unapproved', value: 0 },
  { label: 'Approved', value: 1 },
  { label: 'Rejected', value: 2 },
];

const AddUpdateOffer = () => {
  let location = useLocation();
  let id = location?.state?.data || 0;
  let roleid = localStorage.getItem('roleId');

  const [state, setState] = useState({ id: id });
  const [editImage, setEditImage] = useState(false);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // New state for confirmation dialog
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState(false); // New state for remarks validation

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    const fetchNetworks = roleid != 2 ? getNetworksByUser() : getAllNetworks();
    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
      url: fetchNetworks,
      data: {},
    }).then((response) => {
      if (response.data.errorCode == 0) {
        setNetworks(response.data.data);
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

    if (location?.state?.data) {
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
        url: getOffer(),
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
    let choice = window.confirm('Are you sure you want to add this offer?');
    if (choice) {
      setLoading(true);
      const formData = new FormData();
      for (const key in state) {
        formData.append(key, state[key]);
      }
      formData.set('status', status);
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
        url: addUpdateOffer(),
        data: formData,
      }).then((response) => {
        setLoading(false);
        if (response.data.errorCode === 0) {
          alert(response.data.message);
          window.location.href = roleid != 2 ? '/network' : '/offer';
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
  };

  const handleDelete = () => {
    if (roleid == 2) {
      setDeleteDialogOpen(true);
    } else {
      setConfirmationDialogOpen(true); // Open confirmation dialog for other roles
    }
  };

  const confirmDelete = () => {
    deleteOfferRequest(null);
    setConfirmationDialogOpen(false); // Close confirmation dialog
  };

  const deleteOfferRequest = (remarks) => {
    setLoading(true);
    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
      url: deleteOffer(),
      data: { id: id, remarks: remarks },
    }).then((response) => {
      setLoading(false);
      if (response.data.errorCode == 0) {
        alert(response.data.message);
        window.location.href = roleid != 2 ? '/network' : '/offer';
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

  const handleNetworkChange = (value) => {
    setState({ ...state, network_id: value });
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
        deleteOfferRequest(remarks);
      }
    } else {
      setDeleteDialogOpen(false);
    }
  };

  const { name, description, payout, preview_link, categories, geo, offer_link, img, device, traffic_model, vertical, tracking_type } = state;

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
          <SimpleCard title="Add/Update Offer">
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Autocomplete
                    id="tags-outlined"
                    options={networks || []}
                    value={
                      networks && networks.length > 0
                        ? networks.find((network) => network.id === state.network_id)
                        : null
                    }
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    onChange={(event, newValue) => {
                      if (newValue) handleNetworkChange(newValue.id);
                      else handleNetworkChange(0);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        variant="outlined"
                        label="Network"
                        placeholder="Network"
                        fullWidth
                      />
                    )}
                  />
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
                    type="number"
                    name="payout"
                    label="Payout"
                    onChange={handleChange}
                    value={payout || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="text"
                    name="preview_link"
                    label="Preview Link"
                    value={preview_link || ''}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    name="categories"
                    label="Categories"
                    value={categories || ''}
                    onChange={handleChange}
                  />
                  {roleid == 2 && (
                    <FormControl fullWidth sx={{ mb: 2 }}> {/* Added margin-bottom here */}
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
                  {!id ? (
                    <>
                      <label>Offer Image(50x50): </label>
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
                      <label>Offer Image(50x50): </label>
                      <TextField type="file" name="img" onChange={imageUpload} />
                    </>
                  )}

                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="geo"
                    label="Geo"
                    value={geo || ''}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    name="offer_link"
                    label="Offer Link"
                    value={offer_link || ''}
                    onChange={handleChange}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="text"
                    name="device"
                    label="Device"
                    value={device || ''}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    name="traffic_model"
                    label="Traffic Model"
                    value={traffic_model || ''}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    name="vertical"
                    label="Vertical"
                    value={vertical || ''}
                    onChange={handleChange}
                  />
                  <TextField
                    type="text"
                    name="tracking_type"
                    label="Tracking Type"
                    value={tracking_type || ''}
                    onChange={handleChange}
                  />

                  <Button color="success" variant="contained" type="submit" sx={{ mt: 2 }}> {/* Added margin-top here */}
                    <Icon>send</Icon>
                    <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Save</Span>
                  </Button>
                  {id != 0 && (
                    <Button color="error" variant="contained" onClick={handleDelete} sx={{ mt: 2, ml: 2 }}>
                      <Icon>delete</Icon>
                      <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Delete</Span>
                    </Button>
                  )}
                </Grid>
              </Grid>
            </ValidatorForm>
          </SimpleCard>

          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => handleDeleteDialogClose(false)}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Delete Offer</DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete this offer? Please provide remarks if any.
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
                Are you sure you want to delete this offer?
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

export default AddUpdateOffer;
