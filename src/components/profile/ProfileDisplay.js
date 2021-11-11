import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Button, Card, Grid, Typography } from '@material-ui/core';
import FormSubmission from '../form/FormSubmission';
import { getUser } from 'src/graphql/queries';
import { listForms } from 'src/graphql/queries';
import * as queries from '../../graphql/queries';
// import * as queries from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

const ProfileDisplay = () => {
  const { profileId } = useParams();
  console.log('Profile ID:', profileId)
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserInfo = async () => {
    try {
      const getUserData = await API.graphql(graphqlOperation(getUser, { id: profileId }));
      const listUserData = getUserData.data.getUser;
      setUserData(listUserData);
      setIsLoading(false);
      console.log('list', listUserData);
    } catch (error) {
      console.log('error on fetching videos', error);
    }
  };

  return (
    <>
      <Box>
        {console.log('before submission', formData)}
        {isLoading ? (
          <Typography>Profile is loading...</Typography>
        ) : (
          'User Data goes here'
        )}
        {/* <FormSubmission formDesign = {formData} /> */}
        {console.log('after submission', formData)}
      </Box>
    </>
  )
}

export default ProfileDisplay;
