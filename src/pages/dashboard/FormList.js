import { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { getUser, listForms } from '../../graphql/queries';
import { deleteForm } from '../../graphql/mutations';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
import axios from '../../lib/axios';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Link,
  Typography
} from '@material-ui/core';
import ChevronRightIcon from '../../icons/ChevronRight';
import DownloadIcon from '../../icons/Download';
import PlusIcon from '../../icons/Plus';
import UploadIcon from '../../icons/Upload';
import { CompanyFormsTable } from '../../components/dashboard/company';
import ConfirmDialog from '../../components/form/ConfirmDialog';
import Controls from '../../components/form/controls/_controls';
import FormCreate from '../../components/dashboard/forms/FormCreate';
import Notification from '../../components/form/Notification';

const FormList = () => {
  const isMountedRef = useIsMountedRef();
  const { settings } = useSettings();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [duplicateForm, setDuplicateForm] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: ''
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subtitle: ''
  })

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, [forms]);

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

  // Delete a form
  const formDelete = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteForm, { input: { id: id } }));
      setNotify({
        isOpen: true,
        message: 'Deleted Successfully',
        type: 'success'
      });
    } catch (error) {
      setNotify({
        isOpen: true,
        message: `Failed to Delete: ${error}`,
        type: 'error'
      });
      console.log('error deleting form', error);
    }
  };

  // Delete from database with success/failure notification
  const handleFormDelete = (id, idx) => {
    formDelete(id);
    // Delete from 'forms' state (avoids extra fetchForms API call)
    const newFormsList = [...forms];
    newFormsList.splice(idx, 1);
    setForms(newFormsList);
    // Hide confirmation modal
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    handleListRefresh();
  };

  // Set state for form duplication
  const handleDuplicateForm = (form) => {
    setSelectedForm(form);
    setDuplicateForm(true);
  };

  // Refresh list after a form is deleted or duplicated
  const handleListRefresh = () => {
    setSelectedForm(null);
    setDuplicateForm(false);
    getForms();
  }

  // Go back to list from duplicate form creation view if not submitted
  const handleReturnToList = () => {
    setSelectedForm(null);
    setDuplicateForm(false);
  }

  if (duplicateForm) {
    // Show FormCreate if duplicating from an existing form
    return (
      <Container maxWidth={settings.compact ? 'xl' : false}>
        <Box sx={{ mt: 3 }}>
          <Controls.Button
            // className={classes.componentSpacing}
            marginBottom="40px"
            text="Return to forms list"
            color="secondary"
            fullWidth
            onClick={handleReturnToList}
          />
          <Typography
            // className={classes.componentSpacing}
            margin="40px 0px 40px 10px"
            color="textPrimary"
            variant="h5"
          >
            Create a new validation from an existing form
          </Typography>
          <FormCreate
            selectedForm={selectedForm}
            handleListRefresh={handleListRefresh} />
        </Box>
      </Container>
    )
  } else {
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
              <CompanyFormsTable
                forms={forms}
                setConfirmDialog={setConfirmDialog}
                handleFormDelete={handleFormDelete}
                handleDuplicateForm={handleDuplicateForm}
              />
            </Box>
          </Container>
        </Box>

        {/* Notify of deletion success or failure */}
        <Notification
          notify={notify}
          setNotify={setNotify}
        />

        {/* Prompt user to confirm before deleting form */}
        {confirmDialog.isOpen ? (
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        ) : null}
      </>
    );
  }
};

export default FormList;
