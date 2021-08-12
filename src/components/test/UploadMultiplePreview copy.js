import { Box, Button, Card, Grid, Typography } from '@material-ui/core';
import { Storage } from 'aws-amplify';
import React, { useState } from 'react';
import useAuth from 'src/hooks/useAuth';

const UploadMultiplePreview = () => {
  const { user } = useAuth();
  const userID = user.id;

  // Declare file input reference
  const fileInput = React.useRef();

  // Create image array and call upload function when form is submitted
  const handleSubmissionClick = (event) => {
    event.preventDefault();
    let newArr = fileInput.current.files;
    console.log('newArr', newArr)
    for (let i = 0; i < newArr.length; i++) {
      handleUpload(newArr[i], i);
    }
    console.log('handleSubmissionClick ran', newArr)
  };

  // Prepare files for upload by renaming then uploading to S3
  const handleUpload = async (file, index) => {
    let newFileName = file.name;
    console.log('index', index)

    await Storage.put(`${userID}/a${index+1}_${file.name}`, file, { contentType: 'image' });
  }

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
    console.log("source: ", source);
    return source.map((photo) => {
      return (
        <Grid item style={{ padding: '10px' }} xs={4}>
          <img src={photo} width="100%" height="150px" style={{objectFit: 'cover'}} alt="" key={photo} />
        </Grid>
      )
    });
  };

  return (
    <Grid container justifyContent="center">
      <Grid item style={{ marginTop: '10px' }} xs={6}>
        <Card style={{ padding: 20 }}>
          <Typography variant="h5" p={3}>Upload Image Options</Typography>
          <form className='upload-steps' onSubmit={handleSubmissionClick}>
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
                <Button type='submit' variant="contained" color="secondary" style={{ marginTop: '10px' }}>Upload images to S3</Button>            
              ) : (
                null
              )
            }
            {console.log('fileInput', selectedFiles, selectedFiles.length)}
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UploadMultiplePreview
