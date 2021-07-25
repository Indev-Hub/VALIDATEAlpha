import React from 'react';
import {
  TextField as MuiTextField,
  Typography
} from '@material-ui/core';
import { useField } from 'formik';

const TextField = props => {
  const [field, meta, multiline, maxRows] = useField(props);
  const config = {
    ...field,
    ...props,
    variant: 'outlined',
    multiline: multiline
  };

  if (meta && meta.touched && meta.error) {
    config.error = true;
    config.helperText = meta.error;
  }

  return (
    <div className="form-group">
      <Typography>{props.altlabel}</Typography>
      <MuiTextField {...config} />
    </div>
  );
};

export default TextField;
