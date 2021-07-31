import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Grid, Typography } from '@material-ui/core';
import * as queries from '../../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import AnalyticsGraphBar from './AnalyticsGraphBar';

const AnalyticsSubmissions = () => {
  const { submissionId } = useParams();
  const [submissionData, setSubmissionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Standard GET for the submissions with the same formID as entered in the url parameter "submissionId"
  const getSubmissionInfo = async () => {
    try {
      const getSubmissionData = await API.graphql(graphqlOperation(
        queries.listFormSubmissions,
        { filter: { formID: { eq: submissionId } } },
      ));
      const listSubmissionData = getSubmissionData.data.listFormSubmissions.items;
      console.log('submissions', listSubmissionData);
      setSubmissionData(listSubmissionData);

      setIsLoading(false);

    } catch (error) {
      console.log('error on fetching submissions', error);
    }
  };

  useEffect(() => {
    console.log('useEffect ran')
    getSubmissionInfo();
  }, [])

  // Aggregate answers into a flattened array per question based on questionId
  const aggregateAnswers = (questionId) => {
    let aggregatedAnswers = [];
    submissionData.forEach(response => {
      const answer = JSON.parse(response.answers);
      aggregatedAnswers.push(answer[questionId].answer);
    });
    return aggregatedAnswers.flat();
  };

  if (isLoading) {
    // Notify user of any delays loading data from API call
    return (
      <Box>
        <Typography>Submissions is loading...</Typography>
      </Box>
    )
  } else if (!submissionData.length) {
    // Notify user if there are no submissions yet for this form
    return (
      <Box>
        <Typography>This form has not received any submissions.</Typography>
      </Box>
    )
  } else {
    // Display analytics charts
    const originalFormQuestions = submissionData[0].form.validations;
    return (
      <Box>
        {/* Iterate through each question in the original form to get/pass a full set of answer options */}
        {Object.values(JSON.parse(originalFormQuestions)).map((question, idx) => (
          <Grid key={idx} container spacing={2}>
            <Grid item mt={3} xs>
              <AnalyticsGraphBar
                question={question.question}
                answerOptions={question.options}
                answerType={question.type}
                aggregatedAnswers={aggregateAnswers(question.questionId)}
              />
            </Grid>
          </Grid>
        ))}
      </Box>
    )
  }
}

export default AnalyticsSubmissions;
