import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { SimpleCard } from 'app/components';
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
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Span } from 'app/components/Typography';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { addUpdateStudent, csvUpload, getStudent } from 'app/helper/ApiUrlHelper';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Autocomplete } from '@mui/material';

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

const AddUpdateStudent = () => {
  let location = useLocation();
  let id = location?.state?.data || 0;

  const [state, setState] = useState({ id: id });
  const [loading, setLoading] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [selfImg, setSelfImg] = useState();

  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    if (location?.state?.data) {
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken') },
        url: getStudent(),
        data: { id: id },
      }).then((response) => {
        if (response.data.data) {
          setState(response.data.data);
        } else {
          alert(JSON.stringify(response.data.message));
        }
      });
    }
    setLoading(false);
  }, []);
  const handleSubmit = (event) => {
    let choice = window.confirm('Are you sure you want to add this student?');
    if (choice) {
      setLoading(true);
      const formData = new FormData();
      for (const key in state) {
        formData.append(key, state[key]);
      }
      console.log(formData);
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken') },
        url: addUpdateStudent(),
        data: formData,
      }).then((response) => {
        alert(response.data.message);
        if (response.data.errorCode == 0) {
          window.location.href = '/students';
        }
      });
    }

    // alert(JSON.stringify(state));
  };
  const handleSubmit2 = (event) => {
    let choice = window.confirm('Are you sure you want to upload the CSV?');
    if (choice) {
      setLoading(true);
      const formData = new FormData();
      for (const key in state) {
        formData.append(key, state[key]);
      }
      axios({
        method: 'post',
        headers: { token: localStorage.getItem('accessToken') },
        url: csvUpload(),
        data: formData,
      }).then((response) => {
        alert(response.data.message);
        if (response.data.errorCode == 0) {
          window.location.href = '/students';
        }
      });
    }

    // alert(JSON.stringify(state));
  };
  const handleChange = (event) => {
    event.persist();
    const { name, value } = event.target;

    setState({ ...state, [name]: value });
  };
  const handleDobDateChange = (date) => {
    const formattedDate = date.toISOString().substring(0, 10);
    setState({ ...state, dob: formattedDate });
  };
  const handleDosChange = (value) => {
    setState({ ...state, domain_of_study: value });
  };
  const imageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      if (allowedExtensions.includes(fileExtension)) {
        setState({
          ...state,
          file: selectedFile,
        });
      } else {
        alert('Please select a valid image file (jpg, jpeg, png)');
      }
    } else {
      alert('Please select a file');
    }
  };
  const fileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setState({
        ...state,
        file: selectedFile,
      });
    }
    else {
      alert("Please select a file")
    }
  }

  const handleImageChange = () => {
    if (editImage) setEditImage(false);
    else setEditImage(true);
  };

  const {
    name,
    email,
    dob,
    name_father,
    name_mother,
    domain_of_study,
    board,
    stream,
    school_level,
    name_study,
    student_number,
    guardian_number,
  } = state;

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


          <SimpleCard title="Add/Update Student">
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="name"
                    label="Student Name"
                    onChange={handleChange}
                    value={name || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
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
                    type="number"
                    name="student_number"
                    label="Student Number"
                    onChange={handleChange}
                    value={student_number || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={dob || ''}
                      format="dd/MM/YYYY"
                      onChange={handleDobDateChange}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          label="Date of Birth"
                          id="mui-pickers-date"
                          sx={{ mb: 2, width: '100%' }}
                        />
                      )}
                      inputFormat="dd/MM/yyyy"
                    />
                  </LocalizationProvider>
                  <Autocomplete
                    id="tags-outlined"
                    options={[
                      { status: 0, label: 'School' },
                      { status: 1, label: 'College' },
                    ]}
                    getOptionLabel={(option) => option.label}
                    filterSelectedOptions
                    value={
                      domain_of_study === 0
                        ? { status: 0, label: 'School' }
                        : domain_of_study === 1
                          ? { status: 1, label: 'College' }
                          : { status: '', label: 'Select One' }
                    }
                    onChange={(event, newValue) => {
                      if (newValue) handleDosChange(newValue.status);
                      else handleChange(0);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        variant="outlined"
                        label="Domain Of Study"
                        placeholder="Domain Of Study"
                        fullWidth
                      />
                    )}
                  />
                  {!id ? (
                    <>
                      <label>Student Image</label>
                      <TextField type="file" name="file" onChange={imageUpload} />
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
                      <>
                        <label>Student Image</label>
                        <TextField type="file" name="file" onChange={imageUpload} />
                      </>
                    </>
                  )}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="name_father"
                    label="Father Name"
                    onChange={handleChange}
                    value={name_father || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="text"
                    name="name_mother"
                    label="Mother Name"
                    onChange={handleChange}
                    value={name_mother || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />
                  <TextField
                    type="number"
                    name="guardian_number"
                    label="Guardian Number"
                    onChange={handleChange}
                    value={guardian_number || ''}
                    validators={['required']}
                    errorMessages={['this field is required']}
                  />

                  {domain_of_study === 0 && (
                    <>
                      <TextField
                        type="text"
                        name="board"
                        label="Board"
                        onChange={handleChange}
                        value={board || ''}
                        validators={['required']}
                        errorMessages={['this field is required']}
                      />
                      <TextField
                        type="text"
                        name="school_level"
                        label="School Level"
                        onChange={handleChange}
                        value={school_level || ''}
                        validators={['required']}
                        errorMessages={['this field is required']}
                      />
                    </>
                  )}
                  {domain_of_study === 1 && (
                    <>
                      <TextField
                        type="text"
                        name="stream"
                        label="Stream"
                        onChange={handleChange}
                        value={stream || ''}
                        validators={['required']}
                        errorMessages={['this field is required']}
                      />
                      <TextField
                        type="text"
                        name="name_study"
                        label="Name Of Study"
                        onChange={handleChange}
                        value={name_study || ''}
                        validators={['required']}
                        errorMessages={['this field is required']}
                      />
                    </>
                  )}
                  {editImage && (
                    <>
                      <Button color="warning" variant="contained" onClick={handleImageChange}>
                        <Icon>edit</Icon>
                        <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Update Image</Span>
                      </Button>
                      <br />
                      <br />
                    </>
                  )}
                </Grid>
              </Grid>

              <Button color="success" variant="contained" type="submit">
                <Icon>send</Icon>
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Save</Span>
              </Button>
            </ValidatorForm>
          </SimpleCard>

          <br></br>
          <SimpleCard title="Upload File">
            <ValidatorForm onError={() => null}>
              <Grid container spacing={6}>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                  <Box>
                    <TextField type="file" name="file" onChange={fileUpload} />
                    <Button color="success" variant="contained" onClick={handleSubmit2}>
                      <Icon>send</Icon>
                      <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Upload CSV</Span>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </ValidatorForm>
          </SimpleCard>

        </Container>
      )}
    </>
  );
};

export default AddUpdateStudent;
