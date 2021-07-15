import React from 'react'
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';

const SearchTemplate1 = (props) => {
  const { form, index } = props;

  // Mock tags to simulate upcoming tags feature 
  const tags = ['LOGO', 'PRODUCT', 'PACKAGING', 'IDEA', 'ADVERTISING'];
  const randomTag = tags[Math.floor(Math.random()*(tags.length-index))];
  console.log(randomTag);

  return (
    <Card>
      <Box
        style={{
          backgroundColor: 'black',
          background: `linear-gradient(90deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.3)), url('https://source.unsplash.com/1900x900/?${form.title}')`,
          backgroundSize: 'cover'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            pl:2,
            pt:1,
            color: 'white',
            textShadow: '#000000 4px 2px 6px'
          }}
        >{form.title}
        </Typography>
        <Typography
          sx={{
            pl: 2,
            pb: 1,
            color: 'white',
            textShadow: '#000000 4px 2px 6px'
          }}
        >{form.companyID}
        </Typography>
      </Box>
      <Box
        sx={{ p:2 }}
      >
        <Typography>{form.description}</Typography>
        <Typography>{form.title}</Typography>
        <Box mt={1}>
          {randomTag ? (
            <Typography display="inline" sx={{ fontSize: '11px', fontWeight: '600', color: 'white', backgroundColor: 'blue', borderRadius: '60px', px:2, py:.5 }}>{randomTag}</Typography>
          ) : (
            <span></span>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default SearchTemplate1
