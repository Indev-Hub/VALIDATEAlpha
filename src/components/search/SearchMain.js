import React, { useState, useEffect } from 'react'
import { Grid, Link, Chip, Card, Box } from '@material-ui/core';
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

  useEffect(() => {
    fetchForms();
    fetchSubmission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      // console.log('form list', formList);
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
      // setForms(subInfo);
      // console.log("submission information:", subInfo);
    } catch (error) {
      console.log('error on fetching submission', error);
    }
  };

  //constantly checking what is in filteredTags and removing it from availableTags when filteredTags is updated
  useEffect(() => {
    const postFilteredTags = TAGS.filter(tag => !tagsToFilter.includes(tag));
    setAvailableTags(postFilteredTags);
    // const taggedForms = filteredForms.filter(form => form.tags.includes(...tagsToFilter));
    // const taggedForms = getTaggedForms();
    const taggedForms = updateFilteredForms();
    console.log("taggedForms", taggedForms);
    console.log("tagsToFilter", tagsToFilter)
    setFilteredForms(taggedForms);
    console.log("filteredForms", filteredForms)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsToFilter])

  // useEffect(() => {
  //   for (let i = 0; i < forms.length; i++) {
  //     for (let j = 0; j < tagsToFilter.length; j++) {
  //       if (forms[i].tags.includes(j)) {
  //         setFilteredForms(forms[i])
  //         console.log("forms useEffect Statement", forms[i])
  //       } else {
  //         console.log("forms useEffect did not run")
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [availableTags])

  // useEffect(() => {
  //   for (let i = 0; i < forms.length; i++) {
  //     for (let j = 0; j < forms[i].tags.length; j++) {
  //       if (tagsToFilter.includes(forms[i].tags[j])) {
  //         setFilteredForms(forms[i])
  //       } else {
  //         console.log("setFilterForms loop did not run")
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tagsToFilter])

  // const getTaggedForms = () => {
  //   let filteredFormsArray = [];
  //   tagsToFilter.forEach(tag => {
  //     const taggedForms = filteredForms.filter(form => form.tags.includes(tag));
  //     filteredFormsArray.push(...taggedForms);
  //   });
  //   const setFormsArray = new Set(filteredFormsArray)
  //   console.log(setFormsArray)
  //   console.log(Array.from(setFormsArray))
  //   return Array.from(setFormsArray);
  // }

  // const getTaggedForms = () => {
  //   const taggedForms = filteredForms.filter(form => form.tags.includes(tagsToFilter[tagsToFilter.length - 1]));
  //   return taggedForms;
  // };

  const updateFilteredForms = () => {
    const filtered = forms.filter(form => tagsToFilter.every(tag => form.tags.includes(tag)));
    return filtered;
  }

  const addTag = (tag) => {
    setTagsToFilter([...tagsToFilter, tag]);
    console.log("tags", availableTags)
    // const taggedForms = filteredForms.filter(form => form.tags.includes(...tagsToFilter));
    // console.log("taggedForms", taggedForms)
    // setFilteredForms(taggedForms)
    // for (let i = 0; i < forms.length; i++) {
    //   for (let j = 0; j < forms[i].tags.length; j++) {
    //     if (tagsToFilter.includes(forms[i].tags[j])) {
    //       setFilteredForms(forms[i])
    //     } else {
    //       console.log("setFilteredForms loop did not run")
    //     }
    //   }
    // }
  };

  // Remove tag from mapped array
  const removeTag = (tag) => {
    // const unTaggedForms = filteredForms.filter(form => !form.tags.includes(tag));
    const newTags = tagsToFilter.filter(e => e !== tag);
    setTagsToFilter(newTags)
    // setFilteredForms(forms)
    console.log("newTag", newTags)
    console.log("filteredForms", filteredForms)
    // console.log("unTaggedForms", unTaggedForms)
    console.log("forms", forms)
  };

  return (
    <>
      <Box>
        <Card
          display="flex"
          justifyContent="center"
          sx={{
            mb: 5,
            pt: 3,
            width: "100%",
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
      </Box>
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
