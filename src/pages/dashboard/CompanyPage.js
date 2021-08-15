import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Breadcrumbs, Card, Container, Grid, Link, Typography } from '@material-ui/core';
import { API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../../graphql/queries';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import ChevronRightIcon from '../../icons/ChevronRight';
import gtm from '../../lib/gtm';
import CompanyDashboardTemplate from 'src/components/dashboard/company/CompanyDashboardTemplate';

const CompanyPage = () => {
  const { settings } = useSettings();
  const { user } = useAuth();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  // Set state for User table
  const [userData, setUserData] = useState();
  const [companyData, setCompanyData] = useState([]);

  // Load User table data
  useEffect(() => {
    getUserTable();
  }, [])

  // API call to get User table data
  const getUserTable = async () => {
    try {
      const userData = await API.graphql(graphqlOperation(getUser, { id: user.id }));
      const userList = userData.data.getUser;
      const companyList = userData.data.getUser.companies.items;
      setUserData(userList);
      setCompanyData(companyList);
      console.log('user info', userList);
      console.log('company info', companyList);
    } catch (error) {
      console.log('error on fetching user table', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard: Company | VALIDATE</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid
            alignItems="center"
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                Company
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Dashboard
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Company
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            {/* <Card sx={{ p:3 }}> */}
              <Grid container p={4} xs={12}>
                  {companyData !== null || undefined ? 
                    (
                      companyData.map(company => (
                        <Grid item xs={12} mb={2}>
                            <CompanyDashboardTemplate company={company} />
                        </Grid>
                      ))
                    ) : (
                      <Grid container height="50vh" display="column" justifyContent="center" alignContent="center">
                        <Grid item justifyContent="center" alignContent="center" xs={6} align="center">
                          <Typography variant="h4">You have not added a company yet.</Typography>
                          <Typography variant="h6">The first step to creating forms is to create the company that they will be attached to.</Typography>
                          <Button
                            variant="contained"
                            color="secondary"
                            component={RouterLink}
                            to="/dashboard/company/new"
                            sx={{
                              mt:2
                            }}
                          >
                            Add Company
                          </Button>
                        </Grid>
                      </Grid>
                    )
                  }
                  {console.log('company info', companyData)}
              </Grid>
            {/* </Card> */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CompanyPage;
