import { useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import CompanyDisplay from 'src/components/company/CompanyDisplay';

const CompanyDisplayPage = () => {

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Company | VALIDATE</title>
      </Helmet>
      <Box
        sx={{
          minHeight: 'calc(100vh - 150px)'
        }}
      >
        <CompanyDisplay />
      </Box>
    </>
  );
};

export default CompanyDisplayPage;
