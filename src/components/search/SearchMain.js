import React, { useState, useEffect } from 'react'
import { Grid, Link, Chip } from '@material-ui/core';
import { listForms, listFormSubmissions } from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import SearchForms from './SearchForms';
import SearchTemplate1 from './SearchTemplate1';
import { TAGS } from '../dashboard/forms/FormConstants.js';


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

  const [availableTags, setAvailableTags] = useState([]);

  const [tagsToFilter, setTagsToFilter] = useState([]);

  useEffect(() => {
    const postFilteredTags = TAGS.filter(tag => !tagsToFilter.includes(tag));
    setAvailableTags(postFilteredTags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsToFilter])

  const addTag = (tag) => {
    // const tagToAdd = availableTags[tagidx];
    const filteredForms = forms.filter(form => form.tags.includes(tag));
    setTagsToFilter([...tagsToFilter, tag])
    setForms(filteredForms);
  };

  // Remove tag from mapped array

  const removeTag = (tag) => {
    const filteredForms = forms.filter(form => form.tags.includes(tag));
    const newTags = tagsToFilter.filter(e => e !== tag);
    setForms(filteredForms)
    setTagsToFilter(newTags)
  };

  return (
    <>
      <Grid container justifyContent="center">
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
                  m: 1,
                  mb: 5,
                  p: 2,
                }}
                color="secondary"
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
                  m: 1,
                  mb: 5,
                  p: 2,
                  backgroundColor: 'blue'
                }}
                onDelete={() => removeTag(tag)}
              />
            )
          })
        }
      </Grid>
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
    </>
  )
}

export default SearchMain
