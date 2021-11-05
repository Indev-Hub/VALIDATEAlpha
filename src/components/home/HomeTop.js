import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import {
  AppBar,
  Box,
  Grid,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@material-ui/core'
import HomeTopSection1 from './HomeTopSection1';

// START TAB FUNCTIONS
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
// END TAB FUNCTIONS

const HomeTop = () => {


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
    <Box
      // backgroundImage="url('https://images.all-free-download.com/images/graphiclarge/pinstripe_diagonal_pattern_clip_art_25174.jpg')"
      sx={{
        // backgroundImage: 'linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)), url(https://st2.depositphotos.com/1063074/11893/v/950/depositphotos_118939722-stock-illustration-diagonal-thin-lines-seamless-pattern.jpg)'
        backgroundImage: 'url(https://st2.depositphotos.com/1063074/11893/v/950/depositphotos_118939722-stock-illustration-diagonal-thin-lines-seamless-pattern.jpg)'
      }}
      minHeight="400px"
    >
      <Box className="container" sx={{ height:'400px' }}>
        <Box className="navStyle" sx={{ display:'flex', justifyContent:'center', backgroundColor:'rgb(255, 255, 255, .95)' }}>
          <Box className="navBar" sx={{ width:'700px' }}>
            <AppBar position="static" elevation={0} sx={{ backgroundColor: 'transparent' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                // textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="STAGE 1" fontColor="red" {...tabContent(0)} />
                <Tab label="STAGE 2" {...tabContent(1)} />
                <Tab label="STAGE 3" {...tabContent(2)} />
                <Tab label="STAGE 4" {...tabContent(3)} />
              </Tabs>
            </AppBar>
          </Box>
        </Box>
        <Box className="Swipeable Box" sx={{ height:'100%' }}>
          <SwipeableViews
            className="Swipeable Views"
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
            style={{
              height:'100%',
            }}
          >
            <TabPanel className="Tab Panel" value={value} index={0}>
              <Grid container className="Grid Container Tab Panel" sx={{ justifyContent:'center', justifyItems:'center', height:'100%' }}>
                  <Grid className="Grid Item Tab Panel" item sx={{  }} xs={12}>
                    <HomeTopSection1 />
                  </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid container sx={{ justifyContent:'center', justifyItems:'center' }}>
                <Grid container xs={12}>
                  <Grid item xs={12}>
                    <HomeTopSection1 />
                  </Grid>
                </Grid>
              </Grid>            
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Grid container sx={{ justifyContent:'center', justifyItems:'center' }}>
                <Grid container xs={12}>
                  <Grid item xs={12}>
                    <HomeTopSection1 />
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Grid container sx={{ justifyContent:'center', justifyItems:'center' }}>
                <Grid container xs={12}>
                  <Grid item xs={12}>
                    <HomeTopSection1 />
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Box>     

    </Box>
  )
}

export default HomeTop
