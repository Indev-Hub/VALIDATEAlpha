/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ControlPointDuplicateIcon
  from '@material-ui/icons/ControlPointDuplicate';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { listForms } from '../../graphql/queries';
import { deleteForm } from '../../graphql/mutations';
import ConfirmDialog from '../../components/form/ConfirmDialog';
import Controls from '../../components/form/controls/_controls';
import FormSubmission from '../../components/form/FormSubmission';
import Notification from '../../components/form/Notification';
import FormCreate from '../../components/dashboard/forms/FormCreate';
import useSettings from '../../hooks/useSettings';

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
  backButton: {
    marginBottom: '40px',
  },
}));

const TestList = () => {
  const classes = useStyles();
  const { settings } = useSettings();

  // Set initial state of forms list, selected form, and other view states
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formDuplicate, setFormDuplicate] = useState(false);
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

  // Fetch forms list on initial render and on delete (via 'notify' state)
  useEffect(() => {
    fetchForms();
  }, [notify]);

  const fetchForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      setForms(formList);
    } catch (error) {
      console.log('error on fetching forms', error);
    }
  };

  const formDelete = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteForm, { input: { id: id } }));
    } catch (error) {
      console.log('error deleting form', error);
    }
  };

  const handleFormDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    formDelete(id);
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      type: 'error'
    });
  };

  const handleFormDuplicate = (form) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setSelectedForm(form);
    setFormDuplicate(true);
  };

  const handleListRefresh = () => {
    fetchForms();
    setSelectedForm(null);
    setFormDuplicate(false);
  }

  const handleReturnToList = () => {
    setSelectedForm(null);
    setFormDuplicate(false);
  }

  if (formDuplicate) {
    // Show FormCreate if duplicating from an existing form
    return (
      <Container maxWidth={settings.compact ? 'xl' : false}>
        <Box sx={{ mt: 3 }}>
          <Controls.Button
            className={classes.backButton}
            text="Return to forms list"
            color="secondary"
            fullWidth
            onClick={handleReturnToList}
          />
          <FormCreate
            formDuplicate={selectedForm}
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
            className={classes.backButton}
            text="Return to forms list"
            color="secondary"
            fullWidth
            onClick={handleReturnToList}
          />
          <FormSubmission formDesign={selectedForm} displaySubmitButton={false} />
        </Box>
      </Container>
    );
  } else {
    // Show list of all forms
    return (
      <>
        <Box
          width="100%"
          alignItems="center"
          justify="center"
          margin="auto"
        >
          {
            forms.map((form, idx) => {
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
                      <Typography
                        variant="h4"
                        className="formTitle"
                        onClick={() => setSelectedForm(form)}
                      >
                        {form.title}
                      </Typography>
                      <Typography variant="h5" className="formTitle">
                        {form.id}
                      </Typography>
                      <Typography className="formTitle">
                        {form.description}
                      </Typography>
                      {/* <Typography className="formDescription">
                        {form.validations}
                      </Typography> */}
                    </Grid>
                    <Tooltip title="Delete">
                      <IconButton
                        className={classes.deleteButton}
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Delete form',
                            subtitle: `Are you sure you want to delete this form? It will be permanently removed and 
                          this action cannot be undone.`,
                            buttonText: 'Delete',
                            onConfirm: () => handleFormDelete(form.id),
                          });
                        }}
                      >
                        <DeleteForeverIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Duplicate">
                      <IconButton
                        className={classes.duplicateButton}
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Duplicate form',
                            subtitle: `Proceeding will redirect you to the form creation page prepopulated with the currently selected form structure.`,
                            buttonText: 'Duplicate',
                            onConfirm: () => handleFormDuplicate(form),
                          });
                        }}
                      >
                        <ControlPointDuplicateIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Paper>
              )
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
      </>
    );
  };
};

export default TestList;
