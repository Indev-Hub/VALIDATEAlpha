import React from 'react';
import { AmplifyS3Image } from "@aws-amplify/ui-react";
import {
  Box,
  Grid,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
  Typography
} from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

// Use aws-sdk
const AWS = require('aws-sdk')

// Set which bucket to pull images from
const myBucket = process.env.REACT_APP_S3_BUCKET

// The myKey variable is not used here because we get the key dynamically in the .map below
// const myKey = 'FILE_NAME.JPG' 

// Set the time limit for how long the signed url will be good for
const signedUrlExpireSeconds = 60 * 1

// Set up function to retrieve images from S3 (used in .map below)
const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  signatureVersion: 'v4',
  region: process.env.REACT_APP_REGION,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY
});

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
          {/* Set up grid so we can define how the images are displayed based on screen width */}
          <Grid
            container
            spacing={3}
            mt={2}
          >
            {options.map((option, index) => {
              const id = `${option.id}opt${index + 1}`;
              const optionURL = s3.getSignedUrl('getObject', {
                Bucket: myBucket,
                Key: option,
                Expires: signedUrlExpireSeconds
              })
          
              console.log(optionURL)
              return (
                // <Box display="column" align="left" mb={2}>
                // Switch from Box to Grid to allow for more than one image to be displayed on each row
                // Switch out AmplifyS3Image with optionURL variable
                <Grid
                  item
                  align="center"
                  xs={6}
                >
                  {/* <Box width="500px"> */}
                    <img src={optionURL} width="100%" />
                  {/* </Box> */}
                  {/* <AmplifyS3Image imgKey={option} /> */}
                  {console.log('option', option)}
                  <FormControlLabel
                    key={id}
                    value={option}
                    control={<Radio />}
                  >
                  </FormControlLabel>
                </Grid>
                // </Box>
              )
            })}
          </Grid>
        </MuiRadioGroup>
      </FormControl>
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </div>
  );
};

export default RadioImages;
