import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core'
import { listFormSubmissions } from 'src/graphql/queries';
import { Refresh } from '@material-ui/icons';

function SubmissionList() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, [])

  const fetchSubmissions = async () => {
    try {
      const submissionData = await API.graphql(graphqlOperation(listFormSubmissions));
      const submissionList = submissionData.data.listFormSubmissions.items;
      console.log('submission list', submissionList);
      setSubmissions(submissionList);
    } catch (error) {
      console.log('error on fetching submissions', error);
    }
  }
  return (
    <Box
      width="100%"
      alignItems="center"
      justify="center"
      justifyContent="center"
      margin="auto"
      marginY="50px"
    >
      <Grid container display="column" justifyContent="center">
        <Typography textAlign="center" variant="h4">VALIDATE Submission List</Typography>
        <IconButton
          onClick={fetchSubmissions}
        >
          <Refresh size="large" />
        </IconButton>
      </Grid>
      {submissions.map((submission, idx) => {
        return <Paper variant="outlined" sx={{py: 2, px: 5, m: 1}} key={`submission_${idx}`}>
          <Grid
            container
            display="flex"
            className="videoCard"
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <Typography className="id">Form ID: {submission.id}</Typography>
            </Grid>
            <Grid item>
              <Typography className="form">Form: This needs a created form to generate a value. </Typography>
            </Grid>
            <Grid item>
              <Typography className="formId">Template ID: {submission.formID} </Typography>
            </Grid>
            <Grid item>
              <Typography className="answers">Answers: {submission.answers}</Typography>
            </Grid>
          </Grid>
        </Paper>
      })}
    </Box>
  )
}

export default SubmissionList;
