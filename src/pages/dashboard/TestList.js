/* eslint-disable */
import React, { useState, useEffect } from 'react'
import {
  Box,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import { listForms } from '../../graphql/queries'
import { deleteForm } from '../../graphql/mutations'
import { Grid } from '@material-ui/core'
import Controls from 'src/components/form/controls/_controls'
import FormSubmission from 'src/components/form/FormSubmission'

const TestList = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

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
    formDelete(id);
    fetchForms();
  }

  if (!selectedForm) {
    return (
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
                    {/* <Typography className="formDescription">{form.validations}</Typography> */}
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      type="button"
                      onClick={() => handleFormDelete(form.id)}
                    >
                      <Close />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            )
          })
        }
      </Box>
    )
  } else {
    return (
      <>
        <Controls.Button text="Return to list" color="secondary" fullWidth onClick={() => handleFormSelection(null)} />
        <FormSubmission formDesign={selectedForm} />
      </>
    )
  }
}

export default TestList;
