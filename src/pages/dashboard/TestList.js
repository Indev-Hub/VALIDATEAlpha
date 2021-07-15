/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { listForms } from '../../graphql/queries';
import { deleteForm } from '../../graphql/mutations';
import ConfirmDialog from '../../components/form/ConfirmDialog';
import Controls from '../../components/form/controls/_controls';
import FormSubmission from '../../components/form/FormSubmission';
import Notification from '../../components/form/Notification';

const useStyles = makeStyles(() => ({
  deleteButton: {
    position: 'absolute',
    right: '20px',
  }
}));

const TestList = () => {
  const classes = useStyles();

  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
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

  const handleFormSelection = (form) => {
    setSelectedForm(form);
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

  if (!selectedForm) {
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
                        onClick={() => handleFormSelection(form)}
                      >
                        {form.title}
                      </Typography>
                      <Typography variant="h5" className="formTitle">
                        {form.id}
                      </Typography>
                      <Typography className="formTitle">
                        {form.description}
                      </Typography>
                      <Typography className="formDescription">
                        {form.validations}
                      </Typography>
                    </Grid>
                    <IconButton
                      className={classes.deleteButton}
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Delete form',
                          subtitle: `Are you sure you want to delete this form? It will be permanently removed and 
                          this action cannot be undone.`,
                          onConfirm: () => handleFormDelete(form.id),
                        });
                      }}
                    >
                      <DeleteForeverIcon fontSize="large" />
                    </IconButton>
                  </Grid>
                </Paper>
              )
            })
          }
        </Box>
        <Notification
          notify={notify}
          setNotify={setNotify}
        />
        {confirmDialog.isOpen ? (
          <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
          />
        ) : null}
      </>
    );
  } else {
    return (
      <>
        <Controls.Button
          text="Return to list"
          color="secondary"
          fullWidth
          onClick={() => handleFormSelection(null)}
        />
        <FormSubmission formDesign={selectedForm} displaySubmitButton={false} />
      </>
    );
  };
};

export default TestList;
