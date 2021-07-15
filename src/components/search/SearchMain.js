import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Link,
  Paper,
  Typography
} from '@material-ui/core';
import { listForms } from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import SearchTemplate1 from './SearchTemplate1';

const SearchMain = (props) => {
  const { type } = props;

  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, [])

  const fetchForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      console.log('form list', formList);
      setForms(formList);
    } catch (error) {
      console.log('error on fetching forms', error);
    }
  }

  return (
    <Grid container spacing={2} xs={12}>
      {forms.map((form, index) => (
          <Grid
            item
            xs={4}
            key={index}
            href={`/${form.id}`}
          >
            <Link
              href={`/${form.id}`}
              sx={{
                "&:hover": {
                  textDecoration: 'none',
                }
              }}
            >
              <SearchTemplate1 form={form} index={index} />
            </Link>
            {console.log('form id:', form.id)}
          </Grid>
      ))}
    </Grid>      
  )
}

export default SearchMain
