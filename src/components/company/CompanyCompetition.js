import { Card, Grid, Typography } from '@material-ui/core'
import React from 'react'

const CompanyCompetition = (props) => {
  const { companyData } = props;

  return (
    <>
      <Card sx={{ width:'100%', p:4 }}>
        <Grid item>
          <Typography>COMPANY COMPETITION GOES HERE</Typography>
        </Grid>
      </Card>
    </>
  )
}

export default CompanyCompetition
