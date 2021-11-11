import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Link,
  Tab,
  Tabs,
  Typography
 } from '@material-ui/core';
import ProfilePersonal from './ProfilePersonal';
import ProfileLocation from './ProfileLocation';
import { Button } from '@material-ui/core';
import { createDemographics, updateDemographics, updateUser } from 'src/graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import useAuth from 'src/hooks/useAuth';
import { getDemographics, getUser } from 'src/graphql/queries';
import ProfileOccupation from './ProfileOccupation';
import { Plus } from 'src/icons';
import { Add, AddRounded, PlusOne } from '@material-ui/icons';
import ProfileHobbies from './ProfileHobbies';

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
    birthday: '',
    sex: '',
    gender: '',
    ethnicity: '',
    household: '',
    maritalStatus: '',
    children: '',
    pets: [],
    city: '',
    state: '',
    country: '',
    income: '',
    homeowner: '',
    education: '',
    profession: ''
  })
  
  // Get user attributes
  const { user } = useAuth();
  const userData = user.userTable;
  // console.log('user', user);
  // const [userData, setUserData] = useState();

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

  // Check if User table is loaded
  const [isLoading, setIsLoading] = useState(false);



  // Load User table data
  useEffect(() => {
    // getUserTable();
    getProfile();
    console.log('user table:', userData)
  }, [])

  // API call to get User table data
  // const getUserTable = async () => {
  //   try {
  //     const userData = await API.graphql(graphqlOperation(getUser, { id: user.id }));
  //     const userList = userData.data.getUser;
  //     setUserData(userList);
  //     setIsLoading(false);
  //     console.log('list', userList);
  //     console.log('user sub', user.id)
  //   } catch (error) {
  //     console.log('error on fetching user table', error);
  //   }
  // };

  const updateProfile = async () => {
    try {
      // Did not destructure profileData because it is/will be a very large object

      // Update Demographics Inputs
      const UpdateDemographicsInput = {
        id: user.id,
        userID: user.id,
        birthday: profileData.birthday,
        sex: profileData.sex,
        gender: profileData.gender,
        ethnicity: profileData.ethnicity,
        household: profileData.household,
        maritalStatus: profileData.maritalStatus,
        children: profileData.children,
        pets: profileData.pets,
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        income: profileData.income,
        homeowner: profileData.homeowner,
        education: profileData.education,
        profession: profileData.profession
      };

      // Update Demographics table item
      const demo = await API.graphql(graphqlOperation(updateDemographics, { input: UpdateDemographicsInput }));
      console.log('demo:', demo)
      console.log('Updated Demographics', demo.data.updateDemographics)
      return demo.data.updateDemographics;

    } catch (error) {
      console.log('error on profile demographics update:', error);
    }
  }

  const getProfile = async () => {
    try {
      const demoData = await API.graphql(graphqlOperation(getDemographics, { id: user.id }));
      const demoList = demoData.data.getDemographics;
      setProfileData(demoList);
      console.log('demo list', demoList);
    } catch (error) {
      console.log('error on fetching demographics', error);
    }
  };

  async function addProfile() {
    try {
      // Create Channel Inputs
      const CreateDemographicsInput = {
        id: user.id,
        userID: user.id
      };

      // Create new channel
      const newDemo = await API.graphql(graphqlOperation(createDemographics, { input: CreateDemographicsInput }));
      console.log('new demo:', newDemo)
      return newDemo.data.createDemographics;
      // const setNewChannel = newChannel.data.createChannel;
    } catch (error) {
      console.log('error on profile demographics creation:', error);
    }
  }

  // Update User table to include the new Demographics table item
  async function updateUserTable() {
    // showPendingState();
    try {
      const response = await addProfile();
      console.log('addProfile', response);

      // Data input for updateUser call
      const UpdateUserInput = {
        id: user.id,
        userDemographicsId: response.id
      }

      // Updates the User table to include the newly created Demographics.
      const upUser = await API.graphql(graphqlOperation(updateUser, { input: UpdateUserInput }))
      console.log('User Updated!', upUser) 

    } catch (error) {
        console.log('error on user update:', error);
    }
  }

  const submitButton = () => (
    <Button type="submit" color="secondary" variant="contained" onClick={updateProfile}>Update Profile</Button>
  );

  return (
    <>
      {
        userData.demographics ? (
          <>
            <AppBar position="static">
              <Tabs value={value} onChange={handleTabChange} textColor="white" indicatorColor="secondary" aria-label="simple tabs example">
                <Tab label="Personal" {...menuProps(0)} />
                <Tab label="Occupational" {...menuProps(1)} />
                <Tab label="Interests" {...menuProps(2)} />
              </Tabs>
            </AppBar>          
            <TabPanel value={value} index={0}>
              <ProfilePersonal profileData={profileData} handleProfileChange={handleProfileChange} setProfileData={setProfileData} />
              {/* {console.log('profile data:', profileData)} */}
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ProfileOccupation profileData={profileData} handleProfileChange={handleProfileChange} setProfileData={setProfileData} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ProfileHobbies profileData={profileData} handleProfileChange={handleProfileChange} />
            </TabPanel>
            <Box align="right" mr={3}>
              <Button type="submit" color="secondary" variant="contained" onClick={updateProfile}>Update Profile</Button>    
            </Box>
          </>
        ) : (
          <Grid
            container
            justifyItems="center"
            justifyContent="center"
          >
            <Grid
              item
              sx={{
                width: 400,
                height: 400,
                borner: 4,
                justifyContent: 'center',
                justifyItems: 'center',
                alignContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button
                onClick={updateUserTable}
                sx={{
                  border: 15,
                  borderColor: 'standard.primary',
                  borderRadius: 5,
                  width: '100%',
                  height: '100%',
                }}
              >
                <Box>
                  <Plus sx={{ color: 'standard.primary', fontSize: 350, lineHeight:0, mt: -12 }} />
                  <Typography variant="h3" sx ={{ color: 'standard.primary', mt: -10 }}>Add Demographics</Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>
        )
      }
      
    </>
  );
}

export default ProfileTabs;
