import React, { useState, useEffect } from 'react'
import { Grid, Link, } from '@material-ui/core';
import { listForms, listFormSubmissions } from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import SearchForms from './SearchForms';
import SearchTemplate1 from './SearchTemplate1';

const SearchMain = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
    fetchSubmission();
  }, [])

  const fetchForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      // console.log('form list', formList);
      setForms(formList);
    } catch (error) {
      console.log('error on fetching forms', error);
    }
  }

  // Get number of submissions for each form (this could get ridiculously expensive so may have to find another way to determine this)
  const [submissions, setSubmissions] = useState();

  const fetchSubmission = async () => {
    try {
      const subData = await API.graphql(graphqlOperation(listFormSubmissions));
      const subInfo = subData.data.listFormSubmissions.items;
      setSubmissions(subInfo);
      // setForms(subInfo);
      console.log("submission information:", subInfo);

    } catch (error) {
      console.log('error on fetching submission', error);
    }
  };

  return (
    <Grid container spacing={2} xs={12}>
      {forms.map((form, index) => {
        if (!form.isPrivate) {
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
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
                {/* <SearchForms form={form} index={index} /> */}
                <SearchTemplate1 form={form} submissions={submissions} index={index} />
              </Link>
            </Grid>
          )
        }
      })}
    </Grid>
  )
}

export default SearchMain
