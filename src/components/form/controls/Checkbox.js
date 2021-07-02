import React from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Typography
} from '@material-ui/core';
import { Field, useField } from 'formik';

const Checkbox = (props) => {
  const [_field, meta] = useField({ ...props, type: 'checkbox' });
  const { label, options, name } = props;
  return (
    <div className="form-group">
      {/* <label id='my-checkbox-group'>{label}</label> */}
      <Typography>{label}</Typography>
      <div role='group' aria-labelledby='my-checkbox-group'>
        {options.map(option => {
          const value = Object.values(option)[0];
          const id = value.split(' ').join('-').toLowerCase();
          return (
            <label key={id}>
              <Field
                type='checkbox'
                name={name}
                id={id}
                value={id}
              />
              {value}
            </label>
          )
        })}
      </div>
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </div>
  );
};

export default Checkbox;
