import React, { useState, useEffect } from 'react'
import { Grid, Link, Box, Container, Card, Chip } from '@material-ui/core';
import { listForms, listFormSubmissions } from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import BrowseForms from './BrowseForms';
import SearchField from './SearchField';
import { TAGS } from '../dashboard/forms/FormConstants.js';
import {HighlightOffTwoTone} from '@material-ui/icons'; 


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
        className="Search Container"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          padding: '20px',
          // width: 'auto',
          // margin: 'auto'
        }}
      >
        <Box
          className="Search Box"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            justifyItems: 'center',
            width: '100%'
            // width:'auto',
            // margin:'auto'
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
      {/* <Card
        sx={{
          mb: 5,
          pt: 3,
          mr: "auto",
          ml: "auto",
          // backgroundColor: "black",
          border: 2,
          borderColor: "white",
          zIndex: 1
        }}> */}
      <Box sx=
        {{
          display: 'flex',
          justifyContent: 'center',
          justifyItems: 'center',
          align: 'center' 
        }}
      >
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
                  mx: 1,
                  mb: 3,
                  p: 2,
                  // width: 100,
                  // borderColor: "white",
                  zIndex: 2
                  // color: "white"
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
                  mx: 1,
                  mb: 3,
                  p: 2,
                  zIndex: 2,
                  backgroundColor: 'standard.primary',
                  color: 'white',
                  '&: hover': {
                    color: 'white',
                    cursor: 'pointer'
                  }
                }}
                onDelete={() => removeTag(tag)}
                deleteIcon={<HighlightOffTwoTone style={{ color:'white' }} />}
              />
            )
          })
        }
      </Box>
      {/* </Card> */}
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
