import React, { useState, useEffect } from 'react'
import { Grid, Link, Box, Container, Card, Chip } from '@material-ui/core';
import { listForms, listFormSubmissions } from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import BrowseForms from './BrowseForms';
import SearchField from './SearchField';
import { TAGS } from '../dashboard/forms/FormConstants.js';

const SearchMain = () => {
  const [forms, setForms] = useState([]);
  const [string, setString ] = useState('');
  const [selectedForms, setSelectedForms] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsToFilter, setTagsToFilter] = useState([]);
  


  useEffect(() => {
    fetchForms();
    fetchSubmission();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const fetchForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      setForms(formList);
      setSelectedForms(formList);    } catch (error) {
      console.log('error on fetching forms', error);
    }
  }

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

  useEffect(() => {
    const postFilteredTags = TAGS.filter(tag => !tagsToFilter.includes(tag));
    setAvailableTags(postFilteredTags);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsToFilter])

  const addTag = (tag) => {
    setTagsToFilter([...tagsToFilter, tag]);
  };

  
  const removeTag = (tag) => {
    const newTags = tagsToFilter.filter(e => e !== tag);
    setTagsToFilter(newTags)
  };

  return (
    <>
      <Container
        sx={{
          display: 'flex',
          justifycontent: 'center',
          padding: '20px',
          width: 'auto',
          margin: 'auto'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifycontent: 'center',
            width:'auto',
            margin:'auto'
          }}
        >
          <SearchField
            stringQuery={string}
            setString={setString}
            forms={forms}
            selectedForms={selectedForms}
            setSelectedForms={setSelectedForms} 
            tagsToFilter={tagsToFilter}
          />
        </Box>
      </Container>
      <Card
        sx={{
          mb: 5,
          pt: 3,
          mr: "auto",
          ml: "auto"
        }}>
        {
          availableTags.map(tag => {
            return (
              <Chip
                label={tag}
                type="text"
                id={tag}
                className={tag}
                value={tag}
                sx={{
                  ml: 5,
                  mr: 5,
                  mb: 3,
                  p: 2,
                  width: 100
                }}
                variant="outlined"
                color="primary"
                clickable
                onClick={() => addTag(tag)}
              />
            )
          })
        }
        {
          tagsToFilter.map(tag => {
            return (
              <Chip
                label={tag}
                type="text"
                id={tag}
                className={tag}
                value={tag}
                sx={{
                  ml: 5,
                  mr: 5,
                  mb: 3,
                  p: 2,
                }}
                color="primary"
                clickable
                onDelete={() => removeTag(tag)}
              />
            )
          })
        }
      </Card>
      <Grid 
        container 
        spacing={2} 
        xs={12}
      >
        {selectedForms.map((form, index) => {
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
                  <BrowseForms form={form} submissions={submissions} index={index} />
                </Link>
              </Grid>
            )
          }
        })}
      </Grid>
    </>
  )
}

export default SearchMain;
