import { Card, Grid, Typography } from '@material-ui/core'
import React from 'react'
import MarketComponent from './MarketComponent';

const CompanyMarket = (props) => {
  const { companyData } = props;

  return (
    <>
      {/* <Card sx={{ width:'100%', p:4 }}> */}
        <Grid 
          container
          sx={{
            alignItems: 'stretch',
            direction: 'row'
          }}
          spacing={2} 
          xs={12}
        >
          {/* DEMOGRAPHICS */}
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
          >
            <Card sx={{ p:2, height:'100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ textTransform:'uppercase', textAlign:'center' }} >Demographics</Typography>
                </Grid>
                <MarketComponent field="age" companyData={companyData} />
                <MarketComponent field="sex" companyData={companyData} />
                <MarketComponent field="gender" companyData={companyData} />
                <MarketComponent field="ethnicity" companyData={companyData} />
                <MarketComponent field="state" companyData={companyData} />
                <MarketComponent field="country" companyData={companyData} />
              </Grid>
            </Card>
          </Grid>

          {/* LIFESTYLE */}
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
          >
            <Card sx={{ p:2, height:'100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ textTransform:'uppercase', textAlign:'center' }} >Lifestyle</Typography>
                </Grid>
                <MarketComponent field="household" companyData={companyData} />
                <MarketComponent field="activity" companyData={companyData} />
                <MarketComponent field="hobbies" companyData={companyData} />
                <MarketComponent field="children" companyData={companyData} />
                <MarketComponent field="childrenAge" companyData={companyData} />
              </Grid>
            </Card>
          </Grid>

          {/* OCCUPATION */}
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
          >
            <Card sx={{ p:2, height:'100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ textTransform:'uppercase', textAlign:'center' }} >Occupation</Typography>
                </Grid>
                <MarketComponent field="education" companyData={companyData} />
                <MarketComponent field="industry" companyData={companyData} />
                <MarketComponent field="jobTitle" companyData={companyData} />
                <MarketComponent field="salary" companyData={companyData} />
                <MarketComponent field="contract" companyData={companyData} />
              </Grid>
            </Card>
          </Grid>

        </Grid>
      {/* </Card> */}
    </>
  )
}

export default CompanyMarket
