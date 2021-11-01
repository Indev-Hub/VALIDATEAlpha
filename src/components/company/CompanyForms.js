import React, { useEffect, useState } from 'react';
import { Card, Grid, Link, Typography } from '@material-ui/core'
import BrowseForms from '../search/BrowseForms';
import { listFormSubmissions } from 'src/graphql/queries';
import API from '@aws-amplify/api';
import { graphqlOperation } from '@aws-amplify/api-graphql';

const CompanyForms = (props) => {
  const { companyData } = props;

  // Fetch forms, form submissions, and S3 file list after getUserCompanies
  useEffect(() => {
    fetchSubmission();
  }, []);

  const [submissions, setSubmissions] = useState();

  const fetchSubmission = async () => {
    try {
      const subData = await API.graphql(graphqlOperation(listFormSubmissions));
      const subInfo = subData.data.listFormSubmissions.items;
      setSubmissions(subInfo);
    } catch (error) {
      console.log('error on fetching submission', error);
    }
  };


  return (
    <>
      {/* <Card sx={{ width:'100%', p:4 }}> */}
        <Grid 
          container 
          spacing={2} 
          xs={12}
        >
          {companyData.forms.items.map((form, index) => {
              if (!form.isPrivate) {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                    key={index}
                    href={`/form/${form.id}`}
                  >
                    <Link
                      href={`/form/${form.id}`}
                      sx={{
                        "&:hover": {
                          textDecoration: 'none',
                        }
                      }}
                    >
                      <BrowseForms form={form} submissions={submissions} index={index} />
                    </Link>
                  </Grid>
                )
              }
            })}
          </Grid>
      {/* </Card> */}
    </>
  )
}

export default CompanyForms
