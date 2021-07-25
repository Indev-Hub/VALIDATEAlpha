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
  // Receive form data and index from search mapping in SearchMain component
  const { form, index } = props;

  // Parse tags from form data and construct it for mapping through tags below
  const tags = {items: JSON.parse(form.tags)};

  const readMore = (info) => {
    return <Button>info</Button>
  }

  return (
    <Card style={{ height: '100%' }}>
      <Box
        style={{
          backgroundColor: 'black',
          background: `linear-gradient(90deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.3)), url('https://source.unsplash.com/1900x900/?${form.title}')`,
          backgroundSize: 'cover',
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
        <Typography
          lineHeight={1.2}
        >
          {/* {form.description} */}
          {`${form.description.substring(0, 60)}${form.description.length > 60 ? readMore('Read More') : ''}`}
        </Typography>
        <Box mt={1}>
          {JSON.parse(form.tags).length >= 1 ? (
            // console.log('tag length', JSON.parse(form.tags).length, 'form map', form, 'form tags', tags.items),
            tags.items.map((item, index) => (
              <>
                {/* {console.log('item', item)} */}
                <Typography display="inline" sx={{ fontSize: '11px', fontWeight: '600', color: 'white', backgroundColor: 'blue', borderRadius: '60px', px:2, py:.5, mr:0.5 }}>{item}</Typography>
              </>
            ))
          ) : (
            <Typography>Nothing to show here</Typography>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default SearchTemplate1
