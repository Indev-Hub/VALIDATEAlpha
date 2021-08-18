import React from 'react'
import { Box, Typography } from '@material-ui/core';
import SearchMain from '../search/SearchMain';

const HomeLanding = () => {
  return (
    <Box>
      <Typography id="form-search">Search companies</Typography>
      <SearchMain />
    </Box>
    )
}

export default HomeLanding
