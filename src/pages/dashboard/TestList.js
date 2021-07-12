/* eslint-disable */
import React, { useState, useEffect } from 'react'
import {
  Box,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import { listForms } from '../../graphql/queries'
import { deleteForm } from '../../graphql/mutations'
import { Grid } from '@material-ui/core'
import Controls from '../../components/form/controls/_controls'
import FormSubmission from '../../components/form/FormSubmission'
import Notification from '../../components/form/Notification'
import ConfirmDialog from '../../components/form/ConfirmDialog'


// EXISTING ISSUES
// 1. When a form is deleted, the list of remaining forms is 
//    inconsistently re-rendered to reflect the change
// 2. Custom confirmation dialog for form deletion throws an error
//    "Uncaught TypeError: Cannot read property 'dark' of undefined"

const TestList = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: ''
  })
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subtitle: ''
  })

  useEffect(() => {
    fetchForms();
  }, [])

  const fetchForms = async () => {
    try {
      const formData = await API.graphql(graphqlOperation(listForms));
      const formList = formData.data.listForms.items;
      console.log('form list', formList);
      setForms(formList);
    } catch (error) {
      console.log('error on fetching forms', error);
    }
  }
  const idx = 0;

  const formDelete = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteForm, { input: { id: id } }));
    } catch (error) {
      console.log('error deleting form', error);
    }
  }

  const handleFormSelection = (form) => {
    setSelectedForm(form);
  }

  const handleFormDelete = (id) => {
    if (window.confirm('Delete this form? (This cannot be undone).')) {
      formDelete(id);
      fetchForms();
      setNotify({
        isOpen: true,
        message: 'Deleted Successfully',
        type: 'error'
      });
    }
  }

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
                  // direction="column"
                  // alignItems="left"
                  // justify="center"

                  >
                    <Grid item xs>
                      <Typography variant="h4" className="formTitle" onClick={() => handleFormSelection(form)}>{form.title}</Typography>
                      <Typography variant="h5" className="formTitle">{form.id}</Typography>
                      <Typography className="formTitle">{form.description}</Typography>
                      <Typography className="formDescription">{form.validations}</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        type="button"
                        onClick={() => {
                          // setConfirmDialog({
                          //   isOpen: true,
                          //   title: 'Delete this form?',
                          //   subtitle: 'Warning: this cannot be undone!'
                          // })
                          handleFormDelete(form.id)
                        }}
                      >
                        <DeleteForeverIcon fontSize="large" />
                      </IconButton>
                    </Grid>
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
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      </>
    )
  } else {
    return (
      <>
        <Controls.Button text="Return to list" color="secondary" fullWidth onClick={() => handleFormSelection(null)} />
        <FormSubmission formDesign={selectedForm} displaySubmitButton={false} />
      </>
    )
  }
}

export default TestList;
