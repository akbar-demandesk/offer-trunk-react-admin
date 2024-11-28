import { Box, Button, Card, Grid, styled, TextField } from '@mui/material';
// import { forgetPasswordUrl } from 'app/helper/AdminApiUrlHelper';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { forgotPassword } from 'app/helper/ApiUrlHelper';

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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios({
      method: 'post',
      headers: {},
      url: forgotPassword(),
      data: { email: email },
    }).then((response) => {
      alert(response.data.message);
      if (response.data.errorCode == 0) {
        navigate('/session/resetPassword', { state: { data: email } });
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
                {/* <JustifyBox p={4}>
              <img width="300" src="/assets/images/illustrations/dreamer.svg" alt="" />
            </JustifyBox> */}

                <ContentBox>
                  <form onSubmit={handleFormSubmit}>
                    <TextField
                      type="email"
                      name="email"
                      size="small"
                      label="Email"
                      value={email}
                      variant="outlined"
                      onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
