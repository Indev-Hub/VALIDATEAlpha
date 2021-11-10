import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Chip,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Switch
} from '@material-ui/core';
import { HighlightOffTwoTone } from '@material-ui/icons';
import { API, graphqlOperation } from 'aws-amplify';
import { listForms, listFormSubmissions } from '../../graphql/queries';
import { TAGS } from '../dashboard/forms/FormConstants.js';
import BrowseForms from './BrowseForms';
import SearchField from './SearchField';

const SearchMain = () => {
  const [forms, setForms] = useState([]);
  const [string, setString] = useState('');
  const [selectedForms, setSelectedForms] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsToFilter, setTagsToFilter] = useState([]);
  const [matchCase, setMatchCase] = useState(false);

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
      setSelectedForms(formList);    
    } catch (error) {
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
  }

  useEffect(() => {
    const postFilteredTags = TAGS.filter(tag => !tagsToFilter.includes(tag));
    setAvailableTags(postFilteredTags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsToFilter]);

  const addTag = (tag) => {
    setTagsToFilter([...tagsToFilter, tag]);
  };
  
  const removeTag = (tag) => {
    const newTags = tagsToFilter.filter(e => e !== tag);
    setTagsToFilter(newTags);
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
            matchCase={matchCase}
          />
        </Box>
      </Container>
      <Card
        sx={{
          mb: 5,
          pt: 3,
          mr: "auto",
          ml: "auto",
          backgroundColor: "black",
          border: 2,
          borderColor: "white",
          zIndex: 1
        }}>
          <FormControlLabel 
            sx={{
              mb: 2,
              color: 'white'
            }}
            labelPlacement="top" 
            control={
            <Switch
              onClick={() => setMatchCase(!matchCase)}
              />} 
            label={matchCase ? 'Some Tags' : 'All Tags'}
          />
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
                  width: 100,
                  borderColor: "white",
                  zIndex: 2,
                  color: "white"
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
                  zIndex: 2,
                  backgroundColor: 'white',
                  color: 'black',
                  '&: hover': {
                    color: 'black',
                    cursor: 'pointer'
                  }
                }}
                onDelete={() => removeTag(tag)}
                deleteIcon={<HighlightOffTwoTone/>}
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
                  <BrowseForms 
                    form={form} 
                    submissions={submissions} 
                    index={index} 
                  />
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
