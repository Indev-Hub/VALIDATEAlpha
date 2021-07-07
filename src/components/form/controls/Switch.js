import React from 'react';
import {
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Switch as MuiSwitch,
  Typography,
} from '@material-ui/core';
import { useField } from 'formik';

const Switch = props => {
  const [field, meta] = useField(props);
  const config = {
    ...field,
    ...props,
  };

  if (meta && meta.touched && meta.error) {
    config.error = true;
    config.helperText = meta.error;
  }

  return (
    <div className="form-group">
      <Typography>{props.altlabel}</Typography>
      <FormGroup row>
        <FormControlLabel
          control={<MuiSwitch {...config} />}
          label={props.label}
        />
      </FormGroup>
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </div>
  );
}

export default Switch;
