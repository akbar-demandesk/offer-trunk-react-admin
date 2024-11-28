import { Box, Button, Card, Grid, styled, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { resetPassword } from 'app/helper/ApiUrlHelper';

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    margin: '1rem',
    borderRadius: 12,
  },
}));

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const email = location.state.data;



  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios({
      method: 'post',
      headers: {},
      url: resetPassword(),
      data: { email: email, otp: otp, password: password },
    }).then((response) => {
      alert(response.data.message);
      if (response.data.errorCode == 0) {
        navigate('/session/signin', { state: {} });
      } else if (response.data.errorCode == 2) {
        navigate('/session/forgot-password', { state: {} });
      }
      setLoading(false);
    });
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
        <ForgotPasswordRoot>
          <Card className="card">
            <Grid container>
              <Grid item xs={12}>
                <ContentBox>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      type="email"
                      name="email"
                      size="small"
                      label="email"
                      value={location.state.data}
                      readOnly={true}
                      variant="outlined"
                      // onChange={(e) => setOtp(e.target.value)}
                      sx={{ mb: 3, width: '100%' }}
                    />

                    <TextField
                      type="number"
                      name="otp"
                      size="small"
                      label="OTP"
                      value={otp}
                      variant="outlined"
                      onChange={(e) => setOtp(e.target.value)}
                      sx={{ mb: 3, width: '100%' }}
                    />

                    <TextField
                      type="password"
                      name="password"
                      size="small"
                      label="New Password"
                      value={password}
                      variant="outlined"
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ mb: 3, width: '100%' }}
                    />

                    <Button fullWidth variant="contained" color="success" type="submit">
                      Reset Password
                    </Button>

                    <Button
                      fullWidth
                      color="success"
                      variant="outlined"
                      onClick={() => navigate(-1)}
                      sx={{ mt: 2 }}
                    >
                      Go Back
                    </Button>
                  </form>
                </ContentBox>
              </Grid>
            </Grid>
          </Card>
        </ForgotPasswordRoot>
      )}
    </>
  );
};

export default ResetPassword;
