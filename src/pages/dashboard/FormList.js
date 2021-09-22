/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box, Breadcrumbs, Button, Container, Grid, Link, Typography
} from '@material-ui/core';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { listForms } from '../../graphql/queries';
import { deleteForm } from '../../graphql/mutations';
import { getUser, listFormSubmissions } from '../../graphql/queries';
import { deleteFormSubmission } from '../../graphql/mutations';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import gtm from '../../lib/gtm';
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
  const { settings } = useSettings();
  const { user } = useAuth();
  const [userCompanies, setUserCompanies] = useState();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [duplicateForm, setDuplicateForm] = useState(false);
  const [formImageFiles, setFormImageFiles] = useState();
  const [listRefresh, setListRefresh] = useState(false);
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

  // Get user data from DynamoDB to access associated company info
  const getUserCompanies = async () => {
    try {
      const fetchedUserData = await API.graphql({
        query: getUser,
        variables: { id: user.id }
      });
      const companies = fetchedUserData.data.getUser.companies.items;
      const companyNames = [];
      companies.forEach(company => {
        companyNames.push(company.name)
      })
      setUserCompanies(companyNames);
    } catch (error) {
      console.log('error on fetching user companies', error);
    }
  };

  // Fetch user data from DB to filter forms list on initial render
  useEffect(() => {
    getUserCompanies();
    gtm.push({ event: 'page_view' });
  }, []);

  // Fetch forms array and filter to only include user associated forms
  const getForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      if (userCompanies) {
        const filteredList = formList
          .filter(form => userCompanies.includes(form.companyName));
        setForms(filteredList);
      }
    } catch (err) {
      console.log('error on fetching forms', err);
    }
  };

  // Fetch forms, form submissions, and S3 file list after getUserCompanies
  useEffect(() => {
    getForms();
    getSubmissions();
    getS3FileList();
  }, [userCompanies, listRefresh]);

  // Delete a form from DynamoDB Form table
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

  // Get all form submissions and set in state
  const [submissions, setSubmissions] = useState([]);
  const getSubmissions = async () => {
    try {
      const submissionsData = await API.graphql(
        graphqlOperation(listFormSubmissions)
      );
      const submissionsList = submissionsData.data.listFormSubmissions.items;
      setSubmissions(submissionsList);
    } catch (error) {
      console.log('error on fetching submissions', error);
    }
  };

  // Count submissions based on formID
  const countSubmissions = (formId) => {
    return  submissions.filter(item => item.formID === formId).length;
  };

  // Delete a submission from the DynamoDB FormSubmission table
  const deleteSubmission = async (submissionId) => {
    try {
      await API.graphql(
        graphqlOperation(deleteFormSubmission, { input: { id: submissionId } })
      );
    } catch (error) {
      console.log('error deleting submissions', error);
    }
  };

  // Call deleteSubmission for all forms associated with formId
  const deleteFormSubmissions = (formId) => {
    submissions.forEach(submission => {
      if (submission.formID === formId) {
        deleteSubmission(submission.id)
      };
    });
  };

  // Delete a form's associated S3 files
  const getS3FileList = async () => {
    try {
      const fileList = await Storage.list('');
      setFormImageFiles(fileList);
    } catch (error) {
      console.log('error on fetching file list', error);
    }
  };

  const removeFile = async (fileName) => {
    try {
      await Storage.remove(fileName);
    } catch (error) {
      console.log('error removing file', error);
    }
  };

  const deleteFormImages = (formId) => {
    const fileNames = formImageFiles.filter(file => file.key.includes(formId));
    fileNames.forEach(fileName => {
      removeFile(fileName.key);
    });
  };

  // Delete form and responses from database, and images from S3
  const handleFormDelete = (id) => {
    deleteFormImages(id);
    deleteFormSubmissions(id);
    formDelete(id);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setTimeout(() => handleListRefresh(), 600);
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
    setListRefresh(!listRefresh);
  };

  // Go back to list from duplicate form creation view if not submitted
  const handleReturnToList = () => {
    setSelectedForm(null);
    setDuplicateForm(false);
  };

  if (duplicateForm) {
    // Show FormCreate if duplicating from an existing form
    return (
      <Container maxWidth={settings.compact ? 'xl' : false}>
        <Box sx={{ mt: 3 }}>
          <Controls.Button
            marginBottom="40px"
            text="Return to forms list"
            color="secondary"
            fullWidth
            onClick={handleReturnToList}
          />
          <Typography
            margin="40px 0px 40px 10px"
            color="textPrimary"
            variant="h5"
          >
            Create a new validation from an existing form
          </Typography>
          <FormCreate
            selectedForm={selectedForm}
            handleListRefresh={handleListRefresh}
          />
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
                countSubmissions={countSubmissions}
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
