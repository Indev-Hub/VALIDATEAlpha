import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Button, Card, Grid, Typography } from '@material-ui/core';
import FormSubmission from '../../form/FormSubmission';
import { getForm } from 'src/graphql/queries';
import { listForms } from 'src/graphql/queries';
import * as queries from '../../../graphql/queries';
// import * as queries from '../../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import Enumerable from 'linq';
import Json from './Json';
import { jsonParse } from './jsonModifier';
import AnalyticsGraphBar from './AnalyticsGraphBar';

const AnalyticsSubmissions = () => {
  const { submissionId } = useParams();
  const [submissionData, setSubmissionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect ran')
    getSubmissionInfo();
  }, [])
  
  // Standard GET for the submissions with the same formID as entered in the url parameter "submissionId"
  const getSubmissionInfo = async () => {
    try {
      const getSubmissionData = await API.graphql(graphqlOperation(queries.listFormSubmissions, { filter: {formID: {eq: submissionId}} })); 
      const listSubmissionData = getSubmissionData.data.listFormSubmissions.items;
      console.log('submissions', listSubmissionData);
      setSubmissionData(listSubmissionData);

      setIsLoading(false);

    } catch (error) {
      console.log('error on fetching submissions', error);
    }
  };

  // Reduce submissionData array to the answers key and create new array submissionAnswers from it
  const submissionAnswers = [...new Set(submissionData.map(it => it.answers))];
  console.log('submissionAnswers', submissionAnswers);

  // Clean up the response so it is JSON readable
  const cleanAnswers = JSON.stringify(submissionAnswers).replace(/\\"/g, '\"').replace(/\"\{/g, "\{").replace(/\}\"/g, "\}");
  console.log('cleanAnswers', cleanAnswers);

  // Parse the new clean response data
  const parsedAnswers = JSON.parse(cleanAnswers);
  console.log('parsedAnswers', parsedAnswers);

  // Map out the answers for q1. This is just used for testing purposes now.
  const mappedAnswers = parsedAnswers.map(ans => (
    ans.q1
  ))
  console.log('mappedAnswers', mappedAnswers)

  // Create an array for the questions in each form
  // const questionArray = Object.entries(parsedAnswers).map(([key, value]) => (value))
  // console.log('questionArray', questionArray[0].q2.question)

  const questionArray = parsedAnswers[0];
  console.log('questionArray', questionArray)

  // Count the number of each answer for questions. This function has been moved to AnalyticsBarGraph
  // ------------------------------------------------------------------------------------------------
  // let countAnswers = parsedAnswers.reduce((acc, curr)=>{
  //   const ans = curr.q2.answer;
  //   acc[ans] = (acc[ans] || 0) + 1;
  //   return acc;
  // }, {});
  // console.log('countAnswers', countAnswers);

  // const questionList = parsedAnswers.reduce(acc)


  return (
    <>
      <Box>
        {isLoading ? (
          <>
            <Typography>Submissions is loading...</Typography>
          </>
        ) : (
          <>
            {Object.values(parsedAnswers[0]).map(result => (
              <Grid container spacing={2}>
                <Grid item mt={3} xs>
                  <AnalyticsGraphBar fullData = {submissionData} question={result.question} answers={parsedAnswers} />
                  {console.log('title', result.question)}
                </Grid>
                {/* <Grid item mt={3} xs>
                  <AnalyticsGraphBar fullData = {submissionData} question={parsedAnswers[0].q2.question} answers={parsedAnswers} />
                </Grid> */}
              </Grid>
            ))}
        
          </>
        )}
      </Box>
    </>
  )
}

export default AnalyticsSubmissions;
