import { Card, Grid, Typography } from '@material-ui/core'
import React from 'react'

const HomeTopSection1 = () => {
  return (
    <Grid
      className="HomeTopSection 1 Top"
      container
      xs={12}
    >
      <Grid
        item
        sx={{
          backgroundColor: 'background.paper',
          height: '100%'
        }}
        xs={4}
      >
        <Card
          sx={{
            width: '100%',
            p:4
          }}
        >
          <Typography>
            SOMETHING HERE
          </Typography>
      </Card>
      </Grid>
    </Grid>
  )
}

export default HomeTopSection1
