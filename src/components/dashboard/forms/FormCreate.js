import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Paper,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { Plus } from 'src/icons';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { uniqueId } from 'lodash';
import { createForm } from 'src/graphql/mutations';
import { Close } from '@material-ui/icons';

import Controls from 'src/components/form/controls/_controls';
import FormSubmission from 'src/components/form/FormSubmission';
import formDesign from 'src/components/form/testing/formDesignTestData';
import FormsList from 'src/components/form/testing/FormsList';
import SubmissionsList from 'src/components/form/testing/SubmissionsList';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

// EXISTING ISSUES
// 1. Remove Option removes last item, regardless of 
//    which is selected for removal
// 2. FormSubmission does not yet handle stringified 'validations' data

const FormCreate = () => {
  const INPUT_CONTROLS = [
    'Checkbox',
    'Dropdown',
    'Radio Group',
    'Rating',
    'Text Input',
  ]

  // Company part of form
  const [ownerState, setOwnerState] = useState({
    title: '',
    description: '',
  });

  // Update to company part of form
  const handleOwnerChange = (e) => setOwnerState({
    ...ownerState,
    [e.target.name]: e.target.value,
  });

  // Validation questions part of form
  const blankInput = { question: '', type: '', options: [''] };
  const [inputState, setInputState] = useState([
    { ...blankInput },
  ]);

  // Add question to form and add the new question to our inputState array
  const addInput = () => {
    setInputState([...inputState, { ...blankInput }]);
  };

  // Removes question from mapped array
  const removeInput = (index) => {
    const array = [...inputState]; //make copy
    array.splice(index, 1);
    setInputState([...array]);
  };

  // Update question portion of form every time a field is modified
  const handleInputChange = (e) => {
    const updatedInputs = [...inputState];
    updatedInputs[e.target.dataset.idx][e.target.id] = e.target.value;
    setInputState(updatedInputs);
  };

  // Select answer type
  const handleSelectChange = (questionIndex, e) => {
    const updatedState = [...inputState];
    updatedState[questionIndex].type = e.target.value;
    setInputState(updatedState);
  };

  // Add answer option to form and add the new option to our inputState array
  const addOption = (questionIndex) => {
    const updatedState = [...inputState];
    updatedState[questionIndex].options = [...updatedState[questionIndex].options, '']
    setInputState(updatedState);
  };

  // Removes answer option from mapped array.
  const removeOption = (questionIndex, optionIndex) => {
    const updatedState = [...inputState]; //make copy
    const updatedOptions = updatedState[questionIndex].options;
    updatedState[questionIndex].options = updatedOptions.splice(optionIndex, 1);
    setInputState(updatedState);
  };

  // Update answer option portion of form every time a field is modified
  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const updatedOptions = [...inputState];
    updatedOptions[questionIndex].options[optionIndex] = e.target.value;
    setInputState(updatedOptions);
  };

  // Create full data object to be used as output for DB and prop for form preview
  const createFormDesignDataSet = () => {
    // Create random number for ID (temp solution for unique ID — will add company name and form number later on)
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Destructure form properties
    const { title, description } = ownerState;
    const { question, type, options } = inputState;
    const formID = getRandomInt(1000, 9999);

    // the input data to be sent in our createForm request 
    const formDesignDataSet = {
      id: `form-${formID}`,
      companyID: 'company-1',
      title: title,
      description: description,
      // validations: JSON.stringify(inputState)
      validations: inputState
    };

    return formDesignDataSet;
  };

  // Form preview
  const [formPreview, setFormPreview] = useState(null);

  const previewForm = () => {
    // Get form data set
    const formDesign = createFormDesignDataSet();
    // Update formPreview state
    setFormPreview(formDesign);
  };

  const uploadForm = async () => {
    // Get user attributes
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    const userName = signInUserSession.accessToken.payload.username;
    const userId = signInUserSession.accessToken.payload.sub

    // Output form data set
    console.log('formDesign = ', JSON.stringify(createFormDesignDataSet(), null, 2));
    // await API.graphql(graphqlOperation(createForm, { input: createFormInput }));
  };

  return (
    <>
      <Formik>
        <form>
          {/* Business info part of the form */}
          <TextField
            label="Form Name"
            type="text"
            name="title"
            id="title"
            value={ownerState.title}
            onChange={handleOwnerChange}
            fullWidth
          />
          <TextField
            label="Form Description"
            type="text"
            name="description"
            id="description"
            value={ownerState.description}
            onChange={handleOwnerChange}
            fullWidth
            sx={{
              mt: 2
            }}
          />

          {/* Start mapping the validation questions */}
          {
            inputState.map((val, idx) => {
              const questionId = `question-${idx}`;
              const typeId = `type-${idx}`;
              const optionId = `option-${idx}`;
              const deleteId = `delete-${idx}`;
              return (
                <Card key={`input-${idx}`} sx={{ my: 1 }}>
                  <Box sx={{ backgroundColor: 'black', p: 1, color: 'white' }}>
                    <Typography variant="h6" fullWidth align='center'>{`Question ${idx + 1}`}</Typography>
                  </Box>
                  <Grid container display="flex" sx={{ p: 2 }}>
                    <Grid item xs>
                      <Box>
                        <Typography>Question</Typography>
                      </Box>
                      <Box>
                        <input
                          type="text"
                          name={questionId}
                          placeholder={`Question #${idx + 1}`}
                          data-idx={idx}
                          id="question"
                          className="question"
                          value={inputState[idx].question}
                          onChange={handleInputChange}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Box>
                        <Controls.Select
                          label={'Answer Type'}
                          name={typeId}
                          inputLabel={`Question #${idx + 1} Answer Type`}
                          data-idx={idx}
                          id="type"
                          className="type"
                          value={inputState[idx].type}
                          options={INPUT_CONTROLS}
                          onChange={(e) => handleSelectChange(idx, e)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Box>
                        {/* Start mapping the validation answer options */}
                        {
                          inputState[idx].options.map((opt, optidx) => {
                            const optionId = `option-${optidx}`;
                            const deleteId = `delete-${optidx}`;
                            return (
                              <Card key={`input-${optidx}`} sx={{ my: 1 }}>
                                {/* <Box sx={{ backgroundColor: 'black', p: 1, color: 'white' }}>
                                  <Typography variant="h6" fullWidth align='center'>{`Question ${optidx + 1}`}</Typography>
                                </Box> */}
                                <Grid container display="flex" sx={{ p: 2 }}>
                                  <Grid item xs>
                                    <Box>
                                      <Typography>Option {optidx + 1}</Typography>
                                    </Box>
                                    <TextField
                                      type="text"
                                      name={`option-${optidx + 1}`}
                                      placeholder={`Option ${optidx + 1} for Question #${idx + 1}`}
                                      data-idx={optidx}
                                      id={optidx}
                                      className="option"
                                      value={opt.option}
                                      onChange={(e) => handleOptionChange(idx, optidx, e)}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <IconButton
                                      type="button"
                                      onClick={() => removeOption(idx, optidx)}
                                      id={optidx}
                                    >
                                      <Close />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </Card>
                            );
                          })
                        }
                        <Button
                          type="button"
                          onClick={() => addOption(idx)}
                          variant="contained"
                          color="secondary"
                          sx={{ m: 1, pr: 3 }}
                          startIcon={<Plus />}
                        >
                          Add Option
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        type="button"
                        onClick={() => removeInput(idx)}
                        id={idx}
                      >
                        remove
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              );
            })
          }
          <Button
            type="button"
            onClick={addInput}
            variant="contained"
            color="secondary"
            sx={{ m: 1, pr: 3 }}
            startIcon={<Plus />}
          >
            Add Validation
          </Button>
          <Button
            type="button"
            onClick={previewForm}
            variant="contained"
            color="secondary"
            sx={{ m: 1, pr: 3 }}
          >
            Preview Form
          </Button>
          <Button
            sx={{ mt: 3, padding: 2 }}
            fullWidth
            color="primary"
            type="button"
            variant="contained"
            onClick={uploadForm}
          >
            CREATE FORM
          </Button>
        </form>
      </Formik >

      {
        formPreview ? (
          <div>
            <br />
            <br />
            <Paper mt={4} elevation={3}>
              <Box p={4}>
                {/* <FormSubmission formDesign={formPreview} displaySubmitButton={false} /> */}
                <FormSubmission formDesign={formPreview} displaySubmitButton={false} />
              </Box>
            </Paper>
          </div >
        ) : null}

    </>
  );
};

export default FormCreate;
