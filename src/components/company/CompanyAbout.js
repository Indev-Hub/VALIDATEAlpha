import { Card, Grid, Typography } from '@material-ui/core'
import React from 'react'

const CompanyAbout = (props) => {
  const { companyData } = props;

  return (
    <>
      <Card sx={{ width:'100%', p:4 }}>
        <Grid item>
          <Typography variant="h6" sx={{ textTransform:'uppercase' }} >Description</Typography>
          <Typography>{companyData.description}</Typography>
          <Typography variant="h6" sx={{ textTransform:'uppercase', mt:2 }} >Founded</Typography>
          <Typography>The company was founded in [DATE] and has been around for [YEARS] years</Typography>
          <Typography variant="h6" sx={{ textTransform:'uppercase', mt:2 }} >Location</Typography>
          <Typography>The company is located in [City], [State/Province]</Typography>
        </Grid>
      </Card>
    </>
  )
}

export default CompanyAbout
