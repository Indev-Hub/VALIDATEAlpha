import React from 'react';
import { FormHelperText, Typography } from '@material-ui/core';
import { Rating as MuiRating } from '@material-ui/lab';
import { useField } from 'formik';

const Rating = props => {
  const [field, meta] = useField(props);
  return (
    <div className="form-group">
      <Typography>{props.question}</Typography>
      <MuiRating
        {...field}
        {...props}
        precision={0.5}
      />
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </div>
  );
};

export default Rating;
