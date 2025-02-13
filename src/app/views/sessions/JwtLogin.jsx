import { LoadingButton } from '@mui/lab';
import { Card, Grid, TextField, Button } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRoot = styled(JustifyBox)(() => ({
  backgroundImage: 'url("/assets/images/circles.png"),linear-gradient(to bottom, #0a64bc,rgb(90, 160, 231));)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  minHeight: '100% !important',
  '& .card': {
    maxWidth: 800,
    maxHeight: 500,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
}));

const initialValues = {
  email: '',
  password: '',
  remember: true,
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
});

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (e) {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await googleLogin();
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.error('Google Sign-In error:', error);
      alert('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={12} xs={12}>
            <ContentBox>
              <img src="/logo2.png" width={400} alt="" />
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: '#0a64bc', textDecoration: 'none' }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      loading={loading}
                      variant="contained"
                      sx={{
                        my: 2,
                        width: 1,
                        backgroundColor: '#0a64bc',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#0081ff', // Lighter shade for hover effect
                        },
                      }}
                    >
                      Login
                    </LoadingButton>

                    <Button
                      variant="contained"
                      onClick={handleGoogleLogin}
                      sx={{
                        width: '100%',
                        mt: 2,
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        textTransform: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"  // Different Google logo path
                        alt="Google Logo"
                        style={{ width: 20, height: 20, marginRight: '8px' }}
                      />
                      Sign in with Google
                    </Button>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};

export default JwtLogin;
