import React from 'react'
import { Grid, Typography } from '@material-ui/core';

const MarketComponent = (props) => {
  const { section, field, companyData } = props;
  const data = {
    age: 'Age',
    sex: 'Sex',
    gender: 'Gender',
    ethnicity: 'Ethnicity',
    city: 'City',
    state: 'State',
    country: 'Country',
    household: 'Household Size',
    activity: 'Activity Level',
    hobbies: 'Hobbies',
    children: 'Children',
    childrenAge: 'Kids Age',
    education: 'Education',
    industry: 'Industry',
    jobTitle: 'Job Title',
    salary: 'Salary',
    contract: 'Employment'
  };
  const keyName = data[field];
  const keyValue = companyData[field];

  return (
    <Grid container spacing={1}>
      <Grid
        item
        sx={{
          textAlign:'right'
        }}
        p={0}
        xs={6}
      >
        <Typography>{keyName} </Typography>
        {console.log('key', keyName)}
      </Grid>
      <Grid
        item
        sx={{
          textAlign:'left'
        }}
        p={0}
        xs={6}
      >
        {/* <Typography>{keyValue}</Typography> */}
        <Typography sx={{ fontWeight:'700' }}>{`[${field}]`}</Typography>
        {console.log('value', keyValue)}
      </Grid>
    </Grid>
  )
}

export default MarketComponent
