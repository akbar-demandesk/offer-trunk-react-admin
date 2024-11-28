import { Box } from '@mui/material';
import Switch from '@mui/material/Switch';
import React from 'react';

export default function SimpleSwitch() {
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
  });

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };

  return (
    <Box>
      <Switch
        value="checkedA"
        checked={state.checkedA}
        onChange={handleChange('checkedA')}
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      <Switch
        color="success"
        value="checkedB"
        checked={state.checkedB}
        onChange={handleChange('checkedB')}
        inputProps={{ 'aria-label': 'success checkbox' }}
      />
      <Switch value="checkedC" inputProps={{ 'aria-label': 'success checkbox' }} />
      <Switch disabled value="checkedD" inputProps={{ 'aria-label': 'disabled checkbox' }} />
      <Switch disabled checked value="checkedE" inputProps={{ 'aria-label': 'success checkbox' }} />

      <Switch
        defaultChecked
        value="checkedF"
        color="default"
        inputProps={{ 'aria-label': 'checkbox with default color' }}
      />
    </Box>
  );
}
