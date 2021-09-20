import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Button, Card, Grid, Typography } from '@material-ui/core';
import FormSubmission from '../form/FormSubmission';
import { getForm } from 'src/graphql/queries';
import { listForms } from 'src/graphql/queries';
import * as queries from '../../graphql/queries';
// import * as queries from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

const SubmissionDisplay = () => {
  const { formId } = useParams();
  console.log('Form ID:', formId)
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFormInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFormInfo = async () => {
    try {
      const getFormData = await API.graphql(graphqlOperation(getForm, { id: formId }));
      const listFormData = getFormData.data.getForm;
      setFormData(listFormData);
      setIsLoading(false);
      console.log('list', listFormData);
    } catch (error) {
      console.log('error on fetching videos', error);
    }
  };

  return (
    <>
      <Box>
        {/* <Button variant="contained" onClick={getFormInfo}>load</Button> */}
        {console.log('before submission', formData)}
        {isLoading ? (
          <Typography>Form is loading...</Typography>
        ) : (
          <FormSubmission formDesign={formData} />
        )}
        {/* <FormSubmission formDesign = {formData} /> */}
        {console.log('after submission', formData)}
      </Box>
    </>
  )
}

export default SubmissionDisplay;
