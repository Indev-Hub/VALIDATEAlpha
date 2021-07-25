import React from 'react';
import {
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Typography
} from '@material-ui/core';
import { Field, useField } from 'formik';

// EXISTING ISSUES
// 1. Unable to get values from MuiCheckbox on submit;
//    using formik <Field type="checkbox" /> instead while troubleshooting

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
            <Grid container key={id} display="flex" alignItems="center" mt={1}>
              <Field
                type='checkbox'
                id={id}
                name={name}
                value={option}
              />
              <Typography pl={1.5}>{option}</Typography>
            </Grid>
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
