import React from 'react';
import { AmplifyS3Image } from "@aws-amplify/ui-react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
  Typography
} from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

const RadioImages = ({
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
  }

  return (
    <div className="form-group">
      <FormControl component="fieldset">
        {/* <FormLabel component="legend">{other.label}</FormLabel> */}
        <Typography>{other.altlabel}</Typography>
        <MuiRadioGroup {...config}>
          {options.map((option, index) => {
            const id = `${option.id}opt${index + 1}`;
            return (
              <Box display="column" align="center" mb={2}>
                <AmplifyS3Image imgKey={option} />
                <FormControlLabel
                  key={id}
                  value={option}
                  control={<Radio />}
                >
                </FormControlLabel>
              </Box>
            )
          })}
        </MuiRadioGroup>
      </FormControl>
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </div>
  );
};

export default RadioImages;
