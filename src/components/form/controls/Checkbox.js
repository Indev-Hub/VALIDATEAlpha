import React from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography
} from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

const Checkbox = ({
  name,
  options,
  ...other
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = e => {
    const { value } = e.target;
    setFieldValue(name, value);
  }

  const config = {
    ...field,
    onChange: handleChange
  }

  if (meta && meta.touched && meta.error) {
    config.error = true;
    // config.helperText = meta.error;
  }

  return (
    <div className="form-group">
      <Typography>{other.question}</Typography>
      <FormGroup row>
        {options.map(option => {
          const key = option.split(' ').join('-').toLowerCase();
          return (
            <FormControlLabel
              key={key}
              control={<MuiCheckbox {...config} />}
              label={option}
            />
          )
        })}
      </FormGroup>
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </div >
  );
};

export default Checkbox;
