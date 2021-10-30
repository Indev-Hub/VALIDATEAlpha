import React, { useEffect, useState } from 'react';
import {
  FormControl, FormControlLabel, FormHelperText, Grid, 
  Radio, RadioGroup as MuiRadioGroup, Typography,
} from '@material-ui/core';
import { Storage } from 'aws-amplify';
import { useField, useFormikContext } from 'formik';

const RadioImages = (props) => {
  const { name, options, previewImages, ...other } = props;
  const [imageFileKeyAndBlob, setImageFileKeyAndBlob] = useState({});

  // Use formik to manage form controls
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (e) => {
    const { value } = e.target;
    setFieldValue(name, value);
  };

  const config = {
    ...field,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    config.error = true;
  }

  // Get blob from S3 for non-preview forms and set fileKey/blob pair in state
  const getS3Image = async (fileKey) => {
    try {
      const image = await Storage.get(fileKey, { download: true });
      setImageFileKeyAndBlob((prevState) => ({
        ...prevState,
        [fileKey]: URL.createObjectURL(image.Body),
      }));
    } catch (error) {
      console.log('Error fetching S3 image', error);
    }
  };

  // Set fileKey/blob object pairs in state on mount
  useEffect(() => {
    // If previewing an image during form creation
    if (previewImages) {
      Object.values(previewImages).forEach((imageSet) => {
        imageSet.forEach((nestedSet) => {
          setImageFileKeyAndBlob((prevState) => ({
            ...prevState,
            [nestedSet[0]]: nestedSet[2],
          }));
        });
      });
    } else {
      // If rendering a full form for submission
      options.forEach((option) => {
        getS3Image(option);
      });
    }
  }, []);

  return (
    <div className='form-group'>
      <FormControl component='fieldset'>
        <Typography>{other.altlabel}</Typography>
        <MuiRadioGroup {...config}>
          <Grid container spacing={3} mt={2}>
            {options.map((option) => (
                <Grid key={option} item align='center' xs={6}>
                  <img src={imageFileKeyAndBlob[option]} width='100%' alt='' />
                  <FormControlLabel
                    value={option}
                    control={<Radio />}
                  ></FormControlLabel>
                </Grid>
            ))}
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
