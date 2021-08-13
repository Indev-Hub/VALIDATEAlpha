import React, { useState, useEffect } from 'react'
import { Grid, Link, } from '@material-ui/core';
import { listForms } from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import SearchForms from './SearchForms';

const SearchMain = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, [])

  const fetchForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      setForms(formList);
    } catch (error) {
      console.log('error on fetching forms', error);
    }
  }

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
                <SearchForms form={form} index={index} />
              </Link>
            </Grid>
          )
        }
      })}
    </Grid>
  )
}

export default SearchMain
