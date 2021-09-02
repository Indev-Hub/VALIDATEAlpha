import React, { useState } from 'react'
import { Box, Typography, Chip, Grid } from '@material-ui/core';
import SearchMain from '../search/SearchMain'
import { TAGS } from '../dashboard/forms/FormConstants.js';
import { makeStyles } from '@material-ui/core/styles';

const HomeLanding = () => {
  return (
    <Box>
      {/* <Typography id="form-search">Search companies</Typography> */}
      <SearchMain />
    </Box>
  )
}

export default HomeLanding
