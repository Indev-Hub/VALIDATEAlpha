import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Typography
} from '@material-ui/core';
import { useField } from 'formik';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Select = props => {
  const [field, meta] = useField(props);
  const classes = useStyles();
  const config = {
    ...field,
    ...props,
  };

  if (meta && meta.touched && meta.error) {
    config.error = true;
    // config.helperText = meta.error;
  }

  return (
    <div className="form-group">
      <Typography>{props.label}</Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="select">Select One</InputLabel>
        <MuiSelect
          {...config}
        >
          {props.options.map(option => {
            const value = Object.values(option)[0];
            const id = value.split(' ').join('-').toLowerCase();
            return (
              <MenuItem key={id} value={id}>{value}</MenuItem>
            )
          })}
        </MuiSelect>
      </FormControl>
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </div>
  );
};

export default Select;
