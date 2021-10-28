import React, { useEffect, useState } from 'react';
import { Grid, Popover, Typography } from '@material-ui/core';
import { Storage } from 'aws-amplify';
import PropTypes from 'prop-types';

const ImagesLegendItem = (props) => {
  const { fileKey, label, legendGridSize } = props;
  const [blobURL, setBlobURL] = useState();

  // Get blob from S3 for thumbnail and zoomed popover and set URL
  const getS3Image = async (fileKey) => {
    try {
      const image = await Storage.get(fileKey, { download: true });
      setBlobURL(URL.createObjectURL(image.Body));
    } catch (error) {
      console.log('Error fetching S3 image', error);
    }
  };

  useEffect(() => {
    getS3Image(fileKey);
  }, []);

  // Image Popover state
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle Popover display of full-sized images
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Grid
      container
      item
      alignItems='center'
      justifyContent='center'
      xs={legendGridSize}
    >
      <Grid
        item
        overflow='hidden'
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup='true'
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <img
          src={blobURL}
          width={40}
          height={40}
          style={{ objectFit: 'cover', borderRadius: 15 }}
          alt=''
        />
        <Popover
          id='mouse-over-popover'
          open={open}
          onClose={handlePopoverClose}
          sx={{ pointerEvents: 'none' }}
          anchorEl={anchorEl}
          anchorReference='anchorPosition'
          anchorPosition={{ top: 200, left: 600 }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableRestoreFocus
        >
          <img src={blobURL} alt='' style={{ maxWidth: 800, maxHeight: 800 }} />
        </Popover>
      </Grid>
      <Grid item>
        <Typography marginLeft='20px' color='textPrimary' component='span'>
          {label}
        </Typography>
      </Grid>
    </Grid>
  );
};

ImagesLegendItem.propTypes = {
  fileKey: PropTypes.string,
  label: PropTypes.string,
  legendGridSize: PropTypes.number,
};

export default ImagesLegendItem;
