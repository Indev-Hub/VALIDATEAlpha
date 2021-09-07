import React, { useState, useEffect } from 'react'
import { Grid, Link, Chip, Card } from '@material-ui/core';
import { listForms, listFormSubmissions } from 'src/graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import SearchForms from './SearchForms';
import SearchTemplate1 from './SearchTemplate1';
import { TAGS } from '../dashboard/forms/FormConstants.js';


const SearchMain = () => {
  const [forms, setForms] = useState([]);

  const [filteredForms, setFilteredForms] = useState([]);

  const [availableTags, setAvailableTags] = useState([]);

  const [tagsToFilter, setTagsToFilter] = useState([]);

  const [word, setWord] = useState("");

  const [filterDisplay, setFilterDisplay] = useState();

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
      setFilteredForms(formList);
      console.log("forms", forms);
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
    } catch (error) {
      console.log('error on fetching submission', error);
    }
  };

  //constantly checking what is in filteredTags and removing it from availableTags when filteredTags is updated
  useEffect(() => {
    const postFilteredTags = TAGS.filter(tag => !tagsToFilter.includes(tag));
    setAvailableTags(postFilteredTags);
    const taggedForms = updateFilteredForms();
    console.log("taggedForms", taggedForms);
    console.log("tagsToFilter", tagsToFilter)
    setFilteredForms(taggedForms);
    console.log("filteredForms", filteredForms)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsToFilter])

  const updateFilteredForms = () => {
    const filtered = forms.filter(form => tagsToFilter.every(tag => form.tags.includes(tag)));
    return filtered;
  }

  const addTag = (tag) => {
    setTagsToFilter([...tagsToFilter, tag]);
  };

  // Remove tag from mapped array
  const removeTag = (tag) => {
    const newTags = tagsToFilter.filter(e => e !== tag);
    setTagsToFilter(newTags)
  };

  return (
    <>
      <Grid
        container
      >
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
      </Grid>
      <Grid container spacing={2} xs={12}>
        {filteredForms.map((form, index) => {
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
