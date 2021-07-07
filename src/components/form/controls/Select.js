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
    minWidth: 240,
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
      <Typography>{props.altLabel}</Typography>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="select">{props.inputLabel || "Select One"}</InputLabel>
        <MuiSelect
          {...config}
        >
          {props.options.map((option, index) => {
            const id = `${option.id}opt${index + 1}`;
            return (
              <MenuItem
                key={id}
                value={option}
              >
                {option}
              </MenuItem>
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
