import { styled } from '@mui/material';
import React, { useEffect } from 'react';
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: { marginBottom: '16px' },
  },
}));

const Blank = () => {
  return <Container></Container>;
};

export default Blank;
