import React, { useEffect, useState } from 'react';
import {
  Box, Breadcrumbs, Button, Container, Grid, Link, Typography
} from '@material-ui/core';
import { API, graphqlOperation } from 'aws-amplify';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import CompanyDashboardTemplate from '../../components/dashboard/company/CompanyDashboardTemplate';
import { getUser } from '../../graphql/queries';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';

const CompanyPage = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [companiesList, setCompaniesList] = useState([])
  const userPlanDummyVariable = false;

  useEffect(() => {
    setCompaniesList(user.userTable.companies.items)
    gtm.push({ event: 'page_view' });
  }, []);

  // Set state for User table
  // const userData = user.userTable;
  // const companiesList = user.userTable.companies.items;

  // ===== START NO LONGER NEEDED. KEPT ONLY FOR REFERENCE =====


  // const [userData, setUserData] = useState();
  // const [companiesList, setCompaniesList] = useState([]);

  // Load User table data
  // useEffect(() => {
  //   getUserTable();
  // }, []);

  // API call to get User table data
  // const getUserTable = async () => {
  //   try {
  //     const fetchedData = await API.graphql(
  //       graphqlOperation(getUser, { id: user.id })
  //     );
  //     const userList = fetchedData.data.getUser;
  //     const companyList = fetchedData.data.getUser.companies.items;
  //     setUserData(userList);
  //     setCompaniesList(companyList);
  //     console.log('user info', userList);
  //     console.log('company info', companyList);
  //   } catch (error) {
  //     console.log('error on fetching user table', error);
  //   }
  // };

  // ===== END NO LONGER NEEDED. KEPT ONLY FOR REFERENCE =====


  return (
    <>
      <Helmet>
        <title>Dashboard: Company | VALIDATE</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            alignItems='center'
            container
            justifyContent='space-between'
            spacing={3}
          >
            <Grid item>
              <Typography color='textPrimary' variant='h5'>
                Company
              </Typography>
              <Breadcrumbs
                aria-label='breadcrumb'
                separator={<ChevronRightIcon fontSize='small' />}
                sx={{ mt: 1 }}
              >
                <Link
                  color='textPrimary'
                  component={RouterLink}
                  to='/dashboard'
                  variant='subtitle2'
                >
                  Dashboard
                </Link>
                <Typography color='textSecondary' variant='subtitle2'>
                  Company
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            {/* <Card sx={{ p:3 }}> */}
            <Grid container p={4} xs={12}>
              {/* {companiesList !== null || undefined ? ( */}
              {companiesList.length > 0 ? (
                companiesList.map((company) => (
                  <Grid item xs={12} mb={2}>
                    <CompanyDashboardTemplate company={company} />
                  </Grid>
                ))
              ) : (
                <Grid
                  container
                  height='50vh'
                  display='column'
                  justifyContent='center'
                  alignContent='center'
                >
                  <Grid
                    item
                    justifyContent='center'
                    alignContent='center'
                    xs={6}
                    align='center'
                  >
                    <Typography color='textPrimary' variant='h4'>
                      You have not added a company yet.
                    </Typography>
                    <Typography color='textSecondary' variant='h6'>
                      The first step to creating forms is to create the company
                      that they will be attached to.
                    </Typography>
                    <Button
                      variant='contained'
                      color='secondary'
                      component={RouterLink}
                      to='/dashboard/company/new'
                      sx={{
                        mt: 2,
                      }}
                    >
                      Add Company
                    </Button>
                  </Grid>
                </Grid>
              )}
              {companiesList.length > 0 && user.plan === "Premium" && <Button
                      variant='contained'
                      color='primary'
                      component={RouterLink}
                      to='/dashboard/company/new'
                      sx={{
                        mt: 2,
                      }}
                    >
                      Add Company
                    </Button>
              }
            </Grid>
            {/* </Card> */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CompanyPage;
