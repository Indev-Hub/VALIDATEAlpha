import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from '@material-ui/core';
import { CompanyFormsTable } from '../../components/dashboard/company';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { getUser, listForms } from '../../graphql/queries';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import PlusIcon from '../../icons/Plus';
import UploadIcon from '../../icons/Upload';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import axios from '../../lib/axios';

const FormList = () => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [forms, setForms] = useState([]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  // const getCustomers = useCallback(async () => {
  //   try {
  //     const response = await axios.get('/api/customers');

  //     if (isMountedRef.current) {
  //       setCustomers(response.data.customers);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [isMountedRef]);

  // useEffect(() => {
  //   getCustomers();
  // }, [getCustomers]);

  // useCallback hook to make api call to receive forms
  const getForms = useCallback(async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;

      if (isMountedRef.current) {
        setForms(formList);
        console.log("formList", formList);
      }
    } catch (err) {
      console.log('error on fetching forms', err);
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getForms();
  }, [getForms]);

  return (
    <>
      <Helmet>
        <title>Dashboard: Form List | VALIDATE</title>
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
            container
            justifyContent="space-between"
            spacing={3}
          >
            <Grid item>
              <Typography
                color="textPrimary"
                variant="h5"
              >
                Form Collection
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
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  Management
                </Link>
                <Typography
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Forms
                </Typography>
              </Breadcrumbs>
              <Box
                sx={{
                  mb: -1,
                  mx: -1,
                  mt: 1
                }}
              >
                <Button
                  color="primary"
                  startIcon={<UploadIcon fontSize="small" />}
                  sx={{ m: 1 }}
                >
                  Import
                </Button>
                <Button
                  color="primary"
                  startIcon={<DownloadIcon fontSize="small" />}
                  sx={{ m: 1 }}
                >
                  Export
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
                <Button
                  color="primary"
                  startIcon={<PlusIcon fontSize="small" />}
                  sx={{ m: 1 }}
                  variant="contained"
                  component={RouterLink}
                  to="/dashboard/test-create"
                >
                  Add Form
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <CompanyFormsTable forms={forms} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default FormList;
