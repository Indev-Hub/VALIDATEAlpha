import React from 'react'
import {
  Box,
  // Button,
  // Container,
  Typography
} from '@material-ui/core';
import SearchMain from '../search/SearchMain';

const HomeLanding = () => {
  return (
    <Box>
      <Typography>Search companies</Typography>
      <SearchMain type="true" />
    </Box>
    )
}

export default HomeLanding