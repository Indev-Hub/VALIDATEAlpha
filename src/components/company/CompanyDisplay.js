import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import {
  AppBar,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import FormSubmission from '../form/FormSubmission';
import { getCompany } from 'src/graphql/queries';
import { listForms } from 'src/graphql/queries';
import * as queries from '../../graphql/queries';
// import * as queries from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import CompanyAbout from './CompanyAbout';
import CompanyMarket from './CompanyMarket';
import CompanyCompetition from './CompanyCompetition';
import CompanyForms from './CompanyForms';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function tabContent(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const CompanyDisplay = () => {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCompanyInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCompanyInfo = async () => {
    try {
      const getCompanyData = await API.graphql(graphqlOperation(getCompany, { id: companyId }));
      const listCompanyData = getCompanyData.data.getCompany;
      setCompanyData(listCompanyData);
      setIsLoading(false);
      console.log('list', listCompanyData);
    } catch (error) {
      console.log('error on fetching companies', error);
    }
  };

  // START TAB FUNCTIONALITY
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  // END TAB FUNCTIONALITY

  return (
    <>
      <Box>
        {isLoading ? (
          <Typography>Company is loading...</Typography>
        ) : (
          <>
            <Grid
              container
              justifyContent="center"
              justifyItems="center"
              xs={12}

            >
              <Grid
                container
                // justifyContent="center"
                // justifyItems="center"
                mt={2}
                mb={4}
                xs={12}
              >
                <Grid
                  item
                  p={4}
                  xs={8}
                >
                  <Box display="flex" alignItems="center">
                    <Typography variant="h2">{companyData.name}</Typography>
                    <Box ml={2}>
                      {companyData.forms.items.length < 1 ? (
                          null
                        ) : (
                          companyData.forms.items.length > 1 ? (
                            <Box
                              sx={{
                                borderRadius: 20,
                                backgroundColor: 'black',
                                color: 'white',
                                py: .5,
                                px: 1.5
                              }}
                            >
                              <Typography fontSize="12px" fontWeight="600">
                                {`${companyData.forms.items.length} Forms`}
                              </Typography>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                borderRadius: 20,
                                backgroundColor: 'black',
                                color: 'white',
                                py: .5,
                                px: 1.5
                              }}
                            >
                              <Typography fontSize="12px" fontWeight="600">
                                {`${companyData.forms.items.length} Form`}
                              </Typography>
                            </Box>
                          )
                        )
                      }
                    </Box>
                  </Box>
                  <Typography>Excerpt will go here. A short synopsis of the company's description.</Typography>
                  <Typography>{companyData.description}</Typography>
                  <Box mt={2}>
                    {JSON.parse(companyData.tags).length > 0 ? (
                      JSON.parse(companyData.tags).map((tag, _index) => (
                      <>
                        <Chip
                          sx={{
                            color: 'white',
                            backgroundColor: 'blue',
                            fontSize: '9.5px',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '.5px',
                            px: 1,
                            mx: .25
                          }}
                          size="small"
                          label={tag} />
                      </>
                      ))
                    ) : (
                      null
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Box className="container" sx={{ }}>
              <Box className="navStyle" sx={{ bgcolor:'black', display:'flex', justifyContent:'center' }}>
                <Box className="navBar" sx={{ width:'700px' }}>
                  <AppBar position="static">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      indicatorColor="secondary"
                      textColor="inherit"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      <Tab label="ABOUT" {...tabContent(0)} />
                      <Tab label="MARKET" {...tabContent(1)} />
                      <Tab label="COMPETITION" {...tabContent(2)} />
                      <Tab label="FORMS" {...tabContent(3)} />
                    </Tabs>
                  </AppBar>
                </Box>
              </Box>
              <Box>
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <Grid container sx={{ justifyContent:'center', justifyItems:'center' }}>
                      <Grid container xs={10} md={8}>
                        <Grid item xs={12}>
                          <CompanyAbout companyData={companyData} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <Grid container sx={{ justifyContent:'center', justifyItems:'center' }}>
                      <Grid container xs={10} md={8}>
                        <Grid item xs={12}>
                          <CompanyMarket companyData={companyData} />
                        </Grid>
                      </Grid>
                    </Grid>            
                  </TabPanel>
                  <TabPanel value={value} index={2} dir={theme.direction}>
                    <Grid container sx={{ justifyContent:'center', justifyItems:'center' }}>
                      <Grid container xs={10} md={8}>
                        <Grid item xs={12}>
                          <CompanyCompetition companyData={companyData} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={3} dir={theme.direction}>
                    <Grid container sx={{ justifyContent:'center', justifyItems:'center' }}>
                      <Grid container xs={10} md={8}>
                        <Grid item xs={12}>
                          <CompanyForms companyData={companyData} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </TabPanel>
                </SwipeableViews>
              </Box>
            </Box>     
          </>
        )}
      </Box>
    </>
  )
}

export default CompanyDisplay;
