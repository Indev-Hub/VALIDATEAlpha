import React from "react";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import ImagesLegendItem from "./ImagesLegendItem";

const ImagesLegend = (props) => {
  const { imageFileKeysAndLabels } = props;

  return (
    <Grid
      container
      border={1}
      borderColor="primary"
      borderRadius="16px"
      padding="15px"
    >
      {imageFileKeysAndLabels.map((keyLabelPair) => (
        <ImagesLegendItem
          key={keyLabelPair[0]}
          fileKey={keyLabelPair[0]}
          legendGridSize={12 / imageFileKeysAndLabels.length}
          label={keyLabelPair[1]}
        />
      ))}
    </Grid>
  );
};

ImagesLegend.propTypes = {
  imageFileKeysAndLabels: PropTypes.array,
};

export default ImagesLegend;
