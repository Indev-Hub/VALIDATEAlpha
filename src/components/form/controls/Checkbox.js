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
  const { altlabel, options, name } = props;
  return (
    <div className="form-group">
      {/* <label id='my-checkbox-group'>{label}</label> */}
      <Typography>{altlabel}</Typography>
      <div role='group' aria-labelledby='my-checkbox-group'>
        {options.map((option, index) => {
          const id = `${option.id}opt${index + 1}`;
          return (
            <label key={id}>
              <Field
                type='checkbox'
                id={id}
                name={name}
                value={option}
              />
              {option}
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
