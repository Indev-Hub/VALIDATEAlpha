import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@material-ui/core';
import { listFormSubmissions } from 'src/graphql/queries';


function FormSubmissionsList(props) {
  const [submissions, setSubmissions] = useState([]);
  const [expanded, setExpanded] = React.useState(null);

  const fetchSubmissions = async () => {
    const filter = {
      formID: { eq: props.id }
    };
    try {
      const submissionsData = await API.graphql({
        query: listFormSubmissions,
        variables: { filter: filter },
      });
      const submissionsList = submissionsData.data.listFormSubmissions.items;
      setSubmissions(submissionsList);
    } catch (error) {
      console.log('error on fetching submissions', error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Box
      width="100%"
      alignItems="center"
      justify="center"
      margin="auto"
    >
      {submissions.map((response, idx) => {
        return (
          <Grid
            key={idx}
            container
            sx={{ m: 1 }}
          >
            <Grid item xs={12}>
              <Accordion
                expanded={expanded === `panel${idx}`}
                onChange={handleChange(`panel${idx}`)}
              >
                <AccordionSummary
                  aria-controls={`panel${idx}d-content`}
                  id={`panel${idx}d-header`}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      "&:hover": {
                        cursor: 'pointer',
                      }
                    }}
                  >
                    {`${response.formID} - Response #${idx + 1}`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Object.keys(JSON.parse(response.answers)).map((key, ansidx) => (
                    <Grid container>
                      <Grid item xs={1} />
                      <Grid item xs={5}>
                        <Typography key={ansidx}>
                          {`${JSON.parse(response.answers)[key].question}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography key={ansidx}>
                          {`${JSON.parse(response.answers)[key].answer}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} />
                    </Grid>
                  )
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        )
      })}
    </Box >
  )
}

export default FormSubmissionsList;
