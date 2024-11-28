// import React, { useEffect, useState } from 'react';
// import { SimpleCard } from 'app/components';
// import CircularProgress from '@mui/material/CircularProgress';
// import {
//   Box,
//   Grid,
//   Icon,
//   IconButton,
//   Button,
//   styled,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TablePagination,
//   TableRow,
//   useTheme,
// } from '@mui/material';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Span } from 'app/components/Typography';
// import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
// import {
//   addUpdateAdmission,
//   addUpdateStudent,
//   getAdmission,
//   getCourses,
//   getNetworks,
//   getStudent,
//   getStudents,
// } from 'app/helper/ApiUrlHelper';
// import { DatePicker } from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { Autocomplete } from '@mui/material';

// const Container = styled('div')(({ theme }) => ({
//   margin: '30px',
//   [theme.breakpoints.down('sm')]: { margin: '16px' },
//   '& .breadcrumb': {
//     marginBottom: '30px',
//     [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
//   },
// }));

// const TextField = styled(TextValidator)(() => ({
//   width: '100%',
//   marginBottom: '16px',
// }));

// const AddUpdateAdmisson = () => {
//   let location = useLocation();
//   let id = location?.state?.data || 0;

//   const [state, setState] = useState({ id: id });
//   const [loading, setLoading] = useState(false);
//   const [students, setStudents] = useState();
//   const [courses, setCourses] = useState();

//   const theme = useTheme();

//   useEffect(() => {
//     setLoading(true);
//     axios({
//       method: 'post',
//       headers: { token: localStorage.getItem('accessToken') },
//       url: getStudents(),
//       data: {},
//     }).then((response) => {
//       if (response.data.data) {
//         setStudents(response.data.data);
//         console.log(response.data.data);
//       } else {
//         alert(response.data.message);
//       }
//     });
//     axios({
//       method: 'post',
//       headers: { token: localStorage.getItem('accessToken') },
//       url: getNetworks(),
//       data: {},
//     }).then((response) => {
//       if (response.data.data) {
//         setCourses(response.data.data);
//       } else {
//         alert(response.data.message);
//       }
//     });
//     if (location?.state?.data) {
//       axios({
//         method: 'post',
//         headers: { token: localStorage.getItem('accessToken') },
//         url: getAdmission(),
//         data: { id: id },
//       }).then((response) => {
//         if (response.data.data) {
//           setState(response.data.data);
//         } else {
//           alert(JSON.stringify(response.data.message));
//         }
//       });
//     }
//     setLoading(false);
//   }, []);

//   const handleSubmit = (event) => {
//     let choice = window.confirm('Please confirm the admission for this student?');
//     if (choice) {
//       setLoading(true);
//       axios({
//         method: 'post',
//         headers: { token: localStorage.getItem('accessToken') },
//         url: addUpdateAdmission(),
//         data: state,
//       }).then((response) => {
//         alert(response.data.message);
//         if (response.data.errorCode == 0) {
//           window.location.href = '/admissions';
//         }
//       });
//     }

//     // alert(JSON.stringify(state));
//   };

//   const handleChange = (event) => {
//     event.persist();
//     const { name, value } = event.target;

//     setState({ ...state, [name]: value });
//   };
//   const handleAdmissionDateChange = (date) => {
//     const formattedDate = date.toISOString().substring(0, 10);
//     setState({ ...state, admission_date: formattedDate });
//   };
//   const handleStudentChange = (value) => {
//     setState({ ...state, student_id: value });
//   };
//   const handleCourseChange = (newValue) => {
//     setState({
//       ...state,
//       course_id: newValue.id,
//       amount_charged: newValue.amount,
//       amount_outstanding: newValue.amount,
//     });
//   };

//   const { amount_charged, amount_outstanding, admission_date, discount, remarks } = state;

//   return (
//     <>
//       {loading ? (
//         <Box
//           sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
//         >
//           <CircularProgress />
//           <br />
//         </Box>
//       ) : (
//         <Container>
//           <SimpleCard title="Add/Update Admission">
//             <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
//               <Grid container spacing={6}>
//                 <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
//                   <Autocomplete
//                     id="tags-outlined"
//                     options={students || []} // Use empty array as fallback if students is not yet populated
//                     value={
//                       students && students.length > 0
//                         ? students.find((student) => student.id === state.student_id)
//                         : null
//                     }
//                     getOptionLabel={(option) => option.name}
//                     filterSelectedOptions
//                     onChange={(event, newValue) => {
//                       if (newValue) handleStudentChange(newValue.id);
//                       else handleStudentChange(0);
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         required
//                         variant="outlined"
//                         label="Student"
//                         placeholder="Student"
//                         fullWidth
//                       />
//                     )}
//                   />
//                   <Autocomplete
//                     id="tags-outlined"
//                     options={courses || []} // Use empty array as fallback if students is not yet populated
//                     value={
//                       courses && courses.length > 0
//                         ? courses.find((course) => course.id === state.course_id)
//                         : null
//                     }
//                     getOptionLabel={(option) => option.name}
//                     filterSelectedOptions
//                     onChange={(event, newValue) => {
//                       if (newValue) handleCourseChange(newValue);
//                       else handleCourseChange();
//                     }}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         required
//                         variant="outlined"
//                         label="Course"
//                         placeholder="Course"
//                         fullWidth
//                       />
//                     )}
//                   />
//                   <LocalizationProvider dateAdapter={AdapterDateFns}>
//                     <DatePicker
//                       value={admission_date || ''}
//                       format="dd/MM/YYYY"
//                       onChange={handleAdmissionDateChange}
//                       renderInput={(props) => (
//                         <TextField
//                           {...props}
//                           label="Admission Date"
//                           id="mui-pickers-date"
//                           sx={{ mb: 2, width: '100%' }}
//                         />
//                       )}
//                       inputFormat="dd/MM/yyyy"
//                     />
//                   </LocalizationProvider>
//                   <TextField
//                     type="text"
//                     name="remarks"
//                     label="Remarks"
//                     onChange={handleChange}
//                     value={remarks || ''}
//                     errorMessages={['this field is required']}
//                   />
//                 </Grid>
//                 <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
//                   <TextField
//                     type="number"
//                     name="amount_charged"
//                     label="Amount Charged"
//                     onChange={handleChange}
//                     value={amount_charged || ''}
//                     validators={['required']}
//                     errorMessages={['this field is required']}
//                   />
//                   <TextField
//                     type="number"
//                     name="amount_outstanding"
//                     label="Amount Outstanding"
//                     onChange={handleChange}
//                     value={amount_outstanding || ''}
//                     validators={['required']}
//                     errorMessages={['this field is required']}
//                   />
//                   <TextField
//                     type="number"
//                     name="discount"
//                     label="Discount"
//                     onChange={handleChange}
//                     value={discount || 0}
//                     validators={['required']}
//                     errorMessages={['this field is required']}
//                   />
//                 </Grid>
//               </Grid>

//               <Button color="success" variant="contained" type="submit">
//                 <Icon>send</Icon>
//                 <Span sx={{ pl: 1, textTransform: 'capitalize' }}>Save</Span>
//               </Button>
//             </ValidatorForm>
//           </SimpleCard>
//         </Container>
//       )}
//     </>
//   );
// };

// export default AddUpdateAdmisson;
