import { useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import About from 'src/components/marketing/About';

const AboutPage = () => {

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>About | VALIDATE</title>
      </Helmet>
      <Box
        sx={{
          minHeight: 'calc(100vh - 150px)'
        }}
      >
        <About />
      </Box>
    </>
  );
};

export default AboutPage;
