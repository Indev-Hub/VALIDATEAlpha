import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Grid,
  Tab,
  Tabs,
  Typography
 } from '@material-ui/core';
import ProfilePersonal from './ProfilePersonal';
import ProfileLocation from './ProfileLocation';
import { Button } from '@material-ui/core';
import { createDemographics } from 'src/graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import useAuth from 'src/hooks/useAuth';
import { getUser } from 'src/graphql/queries';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`company-tabpanel-${index}`}
      aria-labelledby={`company-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function menuProps(index) {
  return {
    id: `company-tab-${index}`,
    'aria-controls': `company-tabpanel-${index}`,
  };
}

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

function ProfileTabs() {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    birthday: '',
    sex: '',
    gender: '',
    household: '',
    maritalStatus: '',
    city: '',
    state: '',
    country: '',
    income: '',
    homeowner: '',
    education: '',
    profession: ''
  })
  // console.log('profile data:', profileData);
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Set state for User table
  const [userData, setUserData] = useState();

  // Get user attributes
  const { user } = useAuth();
  // console.log('user', user);

  // Load User table data
  useEffect(() => {
    getUserTable();
    console.log('user table:', userData)
  }, [])

  // API call to get User table data
  const getUserTable = async () => {
    try {
      const userData = await API.graphql(graphqlOperation(getUser, { id: user.id }));
      const userList = userData.data.getUser;
      setUserData(userList);
      console.log('list', userList);
      console.log('user sub', user.id)
    } catch (error) {
      console.log('error on fetching user table', error);
    }
  };

  async function updateProfile() {
    try {
      // Did not destructure profileData because it is/will be a very large object

      // Create Channel Inputs
      const CreateDemographicsInput = {
        userID: user.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        birthday: profileData.birthday,
        sex: profileData.sex,
        gender: profileData.gender,
        household: profileData.household,
        maritalStatus: profileData.maritalStatus,
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        income: profileData.income,
        homeowner: profileData.homeowner,
        education: profileData.education,
        profession: profileData.profession
      };

      // Create new channel
      const demo = await API.graphql(graphqlOperation(createDemographics, { input: CreateDemographicsInput }));
      console.log('demo:', demo)
      // if (!newChannel.ok) {
      //   throw new Error('ERROR on creating new channel', console.error);
      // }
      console.log('Updated Profile', demo.data.createChannel)
      return demo.data.createDemographics;
      // const setNewChannel = newChannel.data.createChannel;
    } catch (error) {
      console.log('error on profile demographics update:', error);
    }
  }

  const submitButton = () => (
    <Button type="submit" color="secondary" variant="contained" onClick={updateProfile}>Update Profile</Button>
  );

  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleTabChange} textColor="white" indicatorColor="secondary" aria-label="simple tabs example">
          <Tab label="Personal" {...menuProps(0)} />
          <Tab label="Financial" {...menuProps(1)} />
          <Tab label="Location" {...menuProps(2)} />
        </Tabs>
      </AppBar>          
      <TabPanel value={value} index={0}>
        <ProfilePersonal profileData={profileData} handleProfileChange={handleProfileChange} />
        {/* {console.log('profile data:', profileData)} */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Financial Info goes here
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ProfileLocation profileData={profileData} handleProfileChange={handleProfileChange} />
      </TabPanel>
      <Box align="right" mr={3}>
        <Button type="submit" color="secondary" variant="contained" onClick={updateProfile}>Update Profile</Button>    
      </Box>
    </div>
  );
}

export default ProfileTabs;
