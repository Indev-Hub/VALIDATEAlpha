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
  const [resultOne, setResultOne] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSubmissionInfo();
  }, []);

  useEffect(() => {
    getSubmissionAnalytics();
  }, [isLoading]);
  
  const getSubmissionInfo = async () => {
    try {
      const getSubmissionData = await API.graphql(graphqlOperation(queries.listFormSubmissions, { filter: {formID: {eq: submissionId}} })); 
      const listSubmissionData = getSubmissionData.data.listFormSubmissions.items;
      setSubmissionData(listSubmissionData);
      console.log('submissions', JSON.parse(listSubmissionData[0].answers), listSubmissionData);

      setIsLoading(false);

    } catch (error) {
      console.log('error on fetching submissions', error);
    }
  };

  const getSubmissionAnalytics = async () => {
    if (isLoading === false) {
      const numb = "form-5705";
      const result = Enumerable.from(submissionData)
      // .groupBy(g => ( g.answers ))

      .select(s => ({
        answers: s.answers
      //   // max: s.max(m => m.cost),
      //   // min: s.min(m => m.cost),
      //   // avg: s.average(m => m.cost),
      //   // count: s.count(),
      //   // sum: s.sum(s => s.cost)
      }))
      .toArray()
      const newResult = jsonParse(result);
      // console.log('parsed:', newResult)
      setResultOne(JSON.parse(result)); 
    };
  };

  return (
    <>
      <Box>
        {isLoading ? (
          <>
            <Typography>Submissions is loading...</Typography>
          </>
        ) : (
          <>
            {submissionData.map(result => (
              <Box mt={3}>
                <Typography>
                  {result.answers}
                </Typography>
                {/* {result.answers.question.map(answer => (
                  <Typography>
                    {answer}
                  </Typography>
                ))} */}
                {/* <Typography><Json data={result.answers} /></Typography> */}
              </Box>
            ))}
            {/* {console.log('data:', submissionData, 'answers:', resultOne)} */}
            <AnalyticsGraphBar fullData = {submissionData} answers = {resultOne} />
          </>
        )}
      </Box>
    </>
  )
}

export default AnalyticsSubmissions;
