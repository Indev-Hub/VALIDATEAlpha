import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Button, Box, Grid, Typography } from '@material-ui/core';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../../graphql/queries';
import AnalyticsGraphBar from './AnalyticsGraphBar';
import FormSubmissionsList from '../../form/FormSubmissionsList';

const AnalyticsSubmissions = () => {
  const { submissionId } = useParams();
  const [submissionData, setSubmissionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResponses, setShowResponses] = useState(false);

  // Get form's submissions list based on formId parsed from params
  const getSubmissionInfo = async () => {
    try {
      const getSubmissionData = await API.graphql(graphqlOperation(
        queries.listFormSubmissions,
        { filter: { formID: { eq: submissionId } } },
      ));
      const listSubmissionData = getSubmissionData.data.listFormSubmissions.items;
      setSubmissionData(listSubmissionData);
      setIsLoading(false);
    } catch (error) {
      console.log('error on fetching submissions', error);
    }
  };

  useEffect(() => {
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

  const toggleResponsesList = () => {
    setShowResponses(!showResponses);
  }

  if (isLoading) {
    // Notify user of any delays loading data from API call
    return (
      <Box>
        <Typography
          color="textPrimary"
          variant="h6"
        >
          Submissions is loading...
        </Typography>
      </Box>
    )
  } else if (!submissionData.length) {
    // Notify user if there are no submissions yet for this form
    return (
      <Box>
        <Typography
          color="textPrimary"
          variant="h6"
        >
          This form has not received any submissions.
        </Typography>
      </Box>
    )
  } else {
    // Display analytics charts or list of form submissions
    const originalFormQuestions = submissionData[0].form.validations;
    return (
      <>
        {showResponses ? (
          <Box>
            <Button onClick={toggleResponsesList}>SHOW ANALYTICS</Button>
            <FormSubmissionsList submissionData={submissionData} />
          </Box>
        ) : (
          <Box>
            <Button onClick={toggleResponsesList}>SHOW ALL RESPONSES</Button>
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
        )}
      </>
    )
  }
}

export default AnalyticsSubmissions;
