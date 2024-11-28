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
import { addUpdateNetwork, getNetwork, deleteNetwork } from 'app/helper/ApiUrlHelper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import Quill's stylesheet


const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const TextField = styled(TextValidator)(({ theme }) => ({
  width: '100%',
  marginBottom: '16px',
}));

const statusOptions = [
  { label: 'Approved', value: 1 },
  { label: 'Unapproved', value: 0 },
  { label: 'Rejected', value: 2 },
];

const toolbarOptions = [
  [{ 'font': [] }, { 'size': [] }],
  ['bold', 'italic', 'underline'],        // toggled buttons
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'align': [] }],
  ['link'],
];

const AddUpdateNetwork = () => {
  let location = useLocation();
  let id = location?.state?.data || 0;
  let roleid = parseInt(localStorage.getItem('roleId'));

  const [state, setState] = useState({ id: id, review_title: '', review_content: '' });
  const [loading, setLoading] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [status, setStatus] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // New state for confirmation dialog
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState(false); // New state for remarks validation

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    if (location?.state?.data) {
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleId: localStorage.getItem('roleId') },
        url: getNetwork(),
        data: { id: id },
      }).then((response) => {
        if (response.data.data) {
          setState(response.data.data);
          setStatus(response.data.data.status);
        } else {
          alert(JSON.stringify(response.data.message));
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, location?.state?.data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let choice = window.confirm('Are you sure you want to add this network?');
    if (choice) {
      setLoading(true);
      const formData = new FormData();
      for (const key in state) {
        formData.append(key, state[key]);
      }
      formData.set('status', status);
      formData.set('review_title', state.review_title);
      formData.set('review_content', state.review_content); // Include review content

      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
        url: addUpdateNetwork(),
        data: formData,
      }).then((response) => {
        alert(response.data.message);
        window.location.href = '/network';
      }).catch((error) => {
        console.error('Error submitting form:', error);
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
    deleteNetworkRequest(null);
    setConfirmationDialogOpen(false); // Close confirmation dialog
  };

  const deleteNetworkRequest = (remarks) => {
    setLoading(true);
    axios({
      method: 'post',
      headers: { token: localStorage.getItem('accessToken'), roleid: localStorage.getItem('roleId') },
      url: deleteNetwork(),
      data: { id: id, remarks: remarks },
    }).then((response) => {
      alert(response.data.message);
      setLoading(false);
      if (response.data.errorCode === 0) {
        window.location.href = '/network';
      }
    });
  };

  const handleChange = (event) => {
    event.persist();
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleStatusChange = (event, value) => {
    setStatus(value?.value);
  };

  const handleEditorChange = (content) => {
    setState((prevState) => ({
      ...prevState,
      review_content: content,
    }));
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
        deleteNetworkRequest(remarks);
      }
    } else {
      setDeleteDialogOpen(false);
    }
  };

  const { name, description, url, email, skype, phone, img } = state;

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
          <SimpleCard title="Add/Update Network">
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
                    name="url"
                    label="URL (offertrunk.com)"
                    value={url || ''}
                    onChange={handleChange}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  {!id ? (
                    <>
                      <label>Network Image(50x50): </label>
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
                      <label>Network Image(50x50): </label>
                      <TextField type="file" name="img" onChange={imageUpload} />
                    </>
                  )}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="email"
                    name="email"
                    label="Email"
                    value={email || ''}
                    onChange={handleChange}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="text"
                    name="skype"
                    label="Skype Id"
                    value={skype || ''}
                    onChange={handleChange}
                  />
                  <TextField
                    type="number"
                    name="phone"
                    label="Phone"
                    value={phone || ''}
                    onChange={handleChange}
                  />
                  {roleid == 2 && (
                    <Box
                      sx={{
                        width: '100%',
                        marginBottom: '16px',
                      }}
                    >
                      <Autocomplete
                        id="status"
                        options={statusOptions}
                        getOptionLabel={(option) => option.label}
                        value={statusOptions.find(option => option.value === status) || null}
                        onChange={handleStatusChange}
                        renderInput={(params) => (
                          <MuiTextField
                            {...params}
                            variant="outlined"
                            label="Status"
                            placeholder="Status"
                            fullWidth
                            required
                          />
                        )}
                      />
                    </Box>
                  )}

                </Grid>
              </Grid>
              <TextField
                type="text"
                name="review_title"
                label="Review Title"
                onChange={handleChange}
                value={state.review_title || ''}
              />
              <ReactQuill
                theme="snow"
                value={state.review_content || ''}
                onChange={handleEditorChange}
                placeholder='Review Content'
                modules={{ toolbar: toolbarOptions }}
              />
              <br />
              <Button color="success" variant="contained" type="submit">
                <Icon>send</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Save</Span>
              </Button>

              {/* Render Delete Button only when id is not 0 */}
              {id !== 0 && (
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
            <DialogTitle id="delete-dialog-title">Delete Network</DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete this network? Please provide remarks if any.
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
                Are you sure you want to delete this network?
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

export default AddUpdateNetwork;
