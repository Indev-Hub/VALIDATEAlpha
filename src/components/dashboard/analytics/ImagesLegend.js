import React from 'react';
import { Card, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import ImagesLegendItem from './ImagesLegendItem';

const ImagesLegend = (props) => {
  const { imageFileKeysAndLabels } = props;

  return (
    <Card sx={{ p: 1 }}>
      <Grid container>
        {imageFileKeysAndLabels.map((keyLabelPair) => (
          <ImagesLegendItem
            key={keyLabelPair[0]}
            fileKey={keyLabelPair[0]}
            legendGridSize={12 / imageFileKeysAndLabels.length}
            label={keyLabelPair[1]}
          />
        ))}
      </Grid>
    </Card>
  );
};

ImagesLegend.propTypes = {
  imageFileKeysAndLabels: PropTypes.array,
};

export default ImagesLegend;
