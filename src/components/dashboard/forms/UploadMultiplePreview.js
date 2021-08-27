import React, { useState } from 'react';
import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import { Storage } from 'aws-amplify';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  closeButton: {
    position: 'absolute',
    right: '20px',
  },
}));

const UploadMultiplePreview = props => {
  const classes = useStyles();

  // Deconstruct props from FormQuestions
  const { formId, questionIdx, updateRadioImagesOptions, toggleDialog, formImages, setFormImages } = props;

  // Declare file input reference
  const fileInput = React.useRef();

  // Create image array, generate path, call upload function 
  // when form is submitted, and toggle off dialog
  const onClick = () => {
    let images = fileInput.current.files;
    let imageUrls = [];
    let formCollection = [];
    Object.values(images).forEach((image, idx) => {
      const path = `${formId}/q${questionIdx + 1}_a${idx + 1}_${image.name}`;
      console.log("uploadmultiplepreview#onClick", formCollection)
      imageUrls.push(path);
      formCollection.push([image, path])
    })
    setFormImages([
      ...formImages,
      ...formCollection
    ]);
    updateRadioImagesOptions(questionIdx, imageUrls);
    toggleDialog(questionIdx);
  };

  // store images in hook

// const onClick = () => {
//   setImages()
// }

  // Set state for image preview
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Update state for image preview with selected images
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );

      // Replace existing image files with new selected image files
      setSelectedFiles(filesArray)

      // Add new selected image files to existing image files

      // setSelectedFiles((prevImages) => prevImages.concat(filesArray));
      // Array.from(e.target.files).map(
      //   (file) => URL.revokeObjectURL(file) // avoid memory leak
      // );

    }
  };

  const renderPhotos = (source) => {
    return source.map((photo) => {
      return (
        <Grid
          item key={photo}
          style={{ padding: '10px' }}
          xs={4}
        >
          <img
            src={photo}
            width="100%"
            height="150px"
            style={{ objectFit: 'cover' }}
            alt=""
          />
        </Grid>
      )
    });
  };

  return (
    <Grid container justifyContent="center">
      <Grid item style={{ marginTop: '10px', padding: 20 }}>
        <IconButton
          className={classes.closeButton}
          type="button"
          onClick={() => toggleDialog(questionIdx)}
          id={`${questionIdx}`}
        >
          <Close />
        </IconButton>
        <Typography variant="h5" p={3}>Upload Image Options</Typography>

          {/* const toggleImages = async (qstidx) => {
      // Check if the current index already exists in the array
      if (isImage.includes(qstidx)) {
        // Duplicate existing isImage array and return only the items that DO NOT match the current index.
        // When setIsImage operates below it effectively removes the current index from the array.
        const removeImageOption = isImage.filter(items => { return items !== qstidx });

        // Replace isImage array with modified array (without current index)
        setIsImage(removeImageOption);
        console.log('image check true:', isImage, qstidx) // Can be removed if everything is understood and working correctly
        return;
      } */}
        <Button
          variant="contained"
          component="label"
        >
          Upload Images

          {/* This is the input that is still handling the handleImageChange function but is
              hidden so we can use mui button instead because the standard input is uuuuugly. */}
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg"
            id="file"
            ref={fileInput}
            multiple
            onChange={(e) => handleImageChange(e)}
            hidden
          />
        </Button>

        <Grid container className="result">
          {renderPhotos(selectedFiles)}
        </Grid>

        {/* This operation only shows the upload images to s3 button if images have been selected */}
        {selectedFiles.length > 0 ?
          (

            // this is where we will need to transition the image array to state, instead of uploading to s3.
            <Button
              type="button"
              variant="contained"
              color="secondary"
              style={{ marginTop: '10px' }}
              onClick={onClick}
            >
              Upload images to S3
            </Button>
          ) : (
            null
          )
        }
      </Grid>
    </Grid>
  )
};

UploadMultiplePreview.propTypes = {
  formId: PropTypes.string,
  questionIdx: PropTypes.number,
  updateRadioImagesOptions: PropTypes.func,
  toggleDialog: PropTypes.func,
  formImages: PropTypes.array,
  setFormImages: PropTypes.func
};

export default UploadMultiplePreview;
