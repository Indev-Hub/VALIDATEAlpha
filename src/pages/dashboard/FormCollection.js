/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ControlPointDuplicateIcon
  from '@material-ui/icons/ControlPointDuplicate';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { getUser, listForms } from '../../graphql/queries';
import { deleteForm } from '../../graphql/mutations';
import useAuth from '../../hooks/useAuth';
import ConfirmDialog from '../../components/form/ConfirmDialog';
import Controls from '../../components/form/controls/_controls';
import FormSubmission from '../../components/form/FormSubmission';
import Notification from '../../components/form/Notification';
import FormCreate from '../../components/dashboard/forms/FormCreate';
import useSettings from '../../hooks/useSettings';
import FormSubmissionsList from '../../components/form/FormSubmissionsList';

// Position 'delete' and 'duplicate' buttons
const useStyles = makeStyles(() => ({
  deleteButton: {
    position: 'absolute',
    right: '20px',
  },
  duplicateButton: {
    position: 'absolute',
    right: '80px',
  },
  componentSpacing: {
    marginBottom: '40px',
  },
}));

const FormCollection = () => {
  const classes = useStyles();
  const { settings } = useSettings();
  const { user } = useAuth();

  // Set initial state of forms list, selected form, and other view states
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

  // Fetch forms list and user record from DB on initial render
  useEffect(() => {
    fetchForms();
    fetchUserData();
  }, []);

  const fetchForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      setForms(formList);
      console.log("formList", formList);
    } catch (error) {
      console.log('error on fetching forms', error);
    }
  };

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

  const handleFormDelete = (id, idx) => {
    // Delete from database with success/failure notification
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
  };

  // Set state for form duplication
  const handleDuplicateForm = (form) => {
    setSelectedForm(form);
    setDuplicateForm(true);
  };

  // Refresh list after a new form saved from duplication
  const handleListRefresh = () => {
    fetchForms();
    setSelectedForm(null);
    setDuplicateForm(false);
  }

  // Go back to list from individual form or duplicate form creation views
  const handleReturnToList = () => {
    setSelectedForm(null);
    setDuplicateForm(false);
  }

  // Get user data from DynamoDB to access associated company info
  const [userData, setUserData] = useState(null);
  const fetchUserData = async () => {
    try {
      const fetchedUserData = await API.graphql({
        query: getUser,
        variables: { id: user.id }
      });
      console.log("FormCollection#fetchedUserData", fetchedUserData);
      setUserData(fetchedUserData);
      console.log("FormCollection#userData", userData);
    } catch (error) {
      console.log('error on fetching user', error);
    }
  }

  const getUserCompanyIds = () => {
    // If Else statement to prevent error on initial load when userData has not been set yet
    if (userData !== null) {
      const companies = userData.data.getUser.companies.items;
      let companyIds = [];
      companies.forEach(company => {
        companyIds.push(company.id)
      })
      return companyIds;
    } else {
      return console.log("User data is not set yet")
    }
  }

  if (duplicateForm) {
    // Show FormCreate if duplicating from an existing form
    return (
      <Container maxWidth={settings.compact ? 'xl' : false}>
        <Box sx={{ mt: 3 }}>
          <Controls.Button
            className={classes.componentSpacing}
            text="Return to forms list"
            color="secondary"
            fullWidth
            onClick={handleReturnToList}
          />
          <Typography
            className={classes.componentSpacing}
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
  } else if (selectedForm) {
    // Show FormSubmission to display selected form when title is clicked
    return (
      <Container maxWidth={settings.compact ? 'xl' : false}>
        <Box sx={{ mt: 3 }}>
          <Controls.Button
            className={classes.componentSpacing}
            text="Return to forms list"
            color="secondary"
            fullWidth
            onClick={handleReturnToList}
          />
          <FormSubmission formDesign={selectedForm} displaySubmitButton={false} />
          <FormSubmissionsList id={selectedForm.id} />
        </Box>
      </Container>
    );
  } else {
    // Show list of all forms
    return (
      <React.Fragment>
        <Box
          width="100%"
          alignItems="center"
          justify="center"
          margin="auto"
        >
          {
            forms.map((form, idx) => {
              console.log('FormCollection#user', user);
              console.log('user companies', user.companies);
              if (getUserCompanyIds().includes(form.companyID)) {
                return (
                  <Paper
                    variant="outlined"
                    sx={{ py: 2, px: 5, m: 1 }}
                    key={`form_${idx}`}
                  >
                    <Grid
                      container
                      display="flex"
                      className="formCard"
                      direction="column"
                      alignItems="left"
                      justify="center"
                    >
                      <Grid item xs={12}>
                        {/* <Tooltip title="Preview form"> */}
                        <Link
                          color="text.reverse"
                          component={RouterLink}
                          to={`/dashboard/form-analytics/${form.id}`}
                          underline="none"
                          variant="body1"
                        >
                          <Typography
                            variant="h4"
                            className="formTitle"
                            sx={{
                              "&:hover": {
                                cursor: 'pointer',
                              }
                            }}
                          // onClick={() => setSelectedForm(form)}
                          >
                            {form.title}
                          </Typography>
                        </Link>
                        {/* </Tooltip> */}

                        <Typography variant="h5" className="formTitle">
                          {form.id} - {form.isPrivate ? "Private Form" : "Public Form"}
                        </Typography>

                        <Typography className="formTitle">
                          {`URL: https://validatehub.com/form/${form.id}`}
                        </Typography>

                        <Typography className="formTitle">
                          {form.description}
                        </Typography>
                      </Grid>

                      <Tooltip title="Delete">
                        <IconButton
                          className={classes.deleteButton}
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete form',
                              subtitle: `Are you sure you want to delete this form? It will be permanently removed and this action cannot be undone.`,
                              buttonText: 'Delete',
                              onConfirm: () => handleFormDelete(form.id, idx),
                            });
                          }}
                        >
                          <DeleteForeverIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Duplicate">
                        <IconButton
                          className={classes.duplicateButton}
                          onClick={() => handleDuplicateForm(form)}
                        >
                          <ControlPointDuplicateIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Paper>
                )
              }
            })
          }
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
      </React.Fragment>
    );
  };
};

export default FormCollection;
