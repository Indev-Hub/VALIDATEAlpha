import { useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Container, Grid } from '@material-ui/core';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import SubmissionDisplay from 'src/components/submissions/SubmissionDisplay';

const SubmissionFormPage = () => {
  const { settings } = useSettings();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard: Form Submission | VALIDATE</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'lg' : false}>
          <Grid
            container
            justifyContent="space-between"
            spacing={3}
          >
            <SubmissionDisplay />
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default SubmissionFormPage;
