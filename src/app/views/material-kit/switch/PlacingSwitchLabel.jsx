import React from 'react';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function PlacingSwitchLabel() {
  const [value, setValue] = React.useState('female');

  function handleChange(event) {
    setValue(event.target.value);
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">labelPlacement</FormLabel>
      <FormGroup aria-label="position" name="position" value={value} onChange={handleChange} row>
        <FormControlLabel
          value="top"
          control={<Switch color="success" />}
          label="Top"
          labelPlacement="top"
        />
        <FormControlLabel
          value="start"
          control={<Switch color="success" />}
          label="Start"
          labelPlacement="start"
        />
        <FormControlLabel
          value="bottom"
          control={<Switch color="success" />}
          label="Bottom"
          labelPlacement="bottom"
        />
        <FormControlLabel
          value="end"
          control={<Switch color="success" />}
          label="End"
          labelPlacement="end"
        />
      </FormGroup>
    </FormControl>
  );
}

export default PlacingSwitchLabel;
