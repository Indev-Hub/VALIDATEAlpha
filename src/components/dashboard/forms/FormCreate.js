import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createForm } from '../../../graphql/mutations';
import { Formik, Form } from 'formik';
import { isNull, uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Paper,
  Typography
} from '@material-ui/core';
import { Close, DeleteForever } from '@material-ui/icons';
import { Plus } from '../../../icons';
import Controls from '../../form/controls/_controls';
import FormSubmission from '../../form/FormSubmission';
import Notification from '../../form/Notification';

const INPUT_CONTROLS = [
  'Checkbox',
  'Dropdown',
  'Number',
  'Radio Group',
  'Rating',
  'Switch',
  'Text Input',
];

const FormCreate = props => {
  const navigate = useNavigate();

  // This is used if duplicating from existing form in TestList
  const { duplicateForm = null, handleListRefresh } = props;

  // Set state of upload success and failure notifications
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: ''
  })

  // Company part of form
  let initialOwnerState;
  if (duplicateForm) {
    // duplicating from existing form?
    initialOwnerState = {
      title: duplicateForm.title,
      description: duplicateForm.description,
    }
  } else {
    initialOwnerState = {
      title: '',
      description: '',
    }
  };

  // Initialize owner state
  const [ownerState, setOwnerState] = useState(initialOwnerState);

  // Update to company part of form
  const handleOwnerChange = (e) => setOwnerState({
    ...ownerState,
    [e.target.name]: e.target.value,
  });

  // Validation questions part of form
  const blankInput = {
    question: '',
    type: '',
    options: [''],
  };

  let initialInput;
  if (duplicateForm) {
    // duplicating from existing form?
    initialInput = JSON.parse(duplicateForm.validations);
  } else {
    initialInput = [blankInput];
  }

  // Initialize questions state
  const [inputState, setInputState] = useState(initialInput);

  // Add question to form and add the new question to our inputState array
  const addInput = () => {
    setInputState([...inputState, { ...blankInput }]);
  };

  // Remove question from mapped array
  const removeInput = (qstidx) => {
    const updateState = [...inputState]; // make copy
    updateState.splice(qstidx, 1);
    setInputState(updateState);
  };

  // Update question portion of form every time a field is modified
  const handleInputChange = (qstidx, e) => {
    const updateState = [...inputState]; // make copy
    updateState[qstidx].question = e.target.value;
    setInputState(updateState);
  };

  // Select answer type
  const handleSelectChange = (qstidx, e) => {
    const updateState = [...inputState]; // make copy
    updateState[qstidx].type = e.target.value;
    setInputState(updateState);
  };

  // Add answer option to form and add the new option to our inputState array
  const addOption = (qstidx) => {
    const updateState = [...inputState]; // make copy
    updateState[qstidx].options = [...updateState[qstidx].options, '']
    setInputState(updateState);
  };

  // Removes answer option from mapped array.
  const removeOption = (qstidx, optidx) => {
    const updateState = [...inputState]; // make copy
    updateState[qstidx].options.splice(optidx, 1);
    setInputState(updateState);
  };

  // Update answer option portion of form every time a field is modified
  const handleOptionChange = (qstidx, optidx, e) => {
    const updatedOptions = [...inputState]; // make copy
    updatedOptions[qstidx].options[optidx] = e.target.value;
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
    const formID = getRandomInt(1000, 9999);
    const compID = getRandomInt(1000, 9999);

    // the input data to be sent in our createForm request 
    const formDesignDataSet = {
      id: `form-${formID}`, // formNumber?
      companyID: `company-${compID}`, // companyName?
      title: title,
      description: description,
      validations: JSON.stringify(inputState)
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

  // // Reset form to initial state
  // const resetForm = () => {
  //   setOwnerState({
  //     title: '',
  //     description: '',
  //   });
  //   setInputState([
  //     { ...blankInput },
  //   ]);
  //   setFormPreview(null);
  // }
  
  const uploadForm = async () => {
    // Get user attributes
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    const userName = signInUserSession.accessToken.payload.username;
    const userId = signInUserSession.accessToken.payload.sub

    // Output form data set
    const formDesignDataSet = createFormDesignDataSet();
    // console.log('formDesign = ', JSON.stringify(formDesignDataSet, null, 2));
    try {
      await API.graphql(graphqlOperation(createForm, { input: formDesignDataSet }));
      // setNotify({
      //   isOpen: true,
      //   message: 'Uploaded Successfully',
      //   type: 'success'
      // });
      // resetForm();
      // await new Promise(res => { setTimeout(res, 3000); }); // to show notify
      navigate("/dashboard/test-list"); // if submitted from TestCreate route
      handleListRefresh(); // if submitted from TestList route
    } catch (error) {
      console.log('error uploading form', error);
      setNotify({
        isOpen: true,
        message: `Upload Failed: ${error}`,
        type: 'error'
      });
    }
  };

  return (
    <>
      <Formik>
        <Form autoComplete="off">
          {/* Business info part of the form */}
          <Controls.TextField
            label="Form Name"
            type="text"
            name="title"
            id="title"
            value={ownerState.title}
            onChange={handleOwnerChange}
            fullWidth
          />
          <Controls.TextField
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
            inputState.map((qst, qstidx) => {
              const questionId = `question-${qstidx}`;
              const typeId = `type-${qstidx}`;
              const optionId = `option-${qstidx}`;
              const deleteId = `delete-${qstidx}`;
              return (
                <Card key={`input-${qstidx}`} sx={{ my: 1 }}>
                  <Grid container display="flex" sx={{ backgroundColor: 'black', p: 1, color: 'white' }}>
                    <Grid item justifyContent="center" xs={10} md={11}>
                      <Typography variant="h6" fullWidth align='center'>{`Question ${qstidx + 1}`}</Typography>
                    </Grid>
                    <Grid item justifyContent="center" xs={1} md={1}>
                      <Button
                        type="button"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'text.light'
                          }
                        }}
                        onClick={() => removeInput(qstidx)}
                        id={`${qstidx}`}
                      >
                        <DeleteForever />
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} display="flex" sx={{ p: 2 }} row="true">
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Controls.TextField
                          label="Question" // Typography label
                          type="text"
                          name={questionId}
                          placeholder={`Question #${qstidx + 1}`}
                          data-idx={qstidx}
                          id="question"
                          className="question"
                          fullWidth
                          value={inputState[qstidx].question}
                          onChange={(e) => handleInputChange(qstidx, e)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Controls.Select
                          label="Answer Type" // Typography label
                          name={typeId}
                          inputlabel={`Question #${qstidx + 1} Answer Type`}
                          data-idx={qstidx}
                          id="type"
                          className="type"
                          value={inputState[qstidx].type}
                          options={INPUT_CONTROLS}
                          onChange={(e) => handleSelectChange(qstidx, e)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box>
                        {/* Start mapping the validation answer options */}
                        {
                          inputState[qstidx].options.map((opt, optidx) => {
                            const optionId = `option-${optidx}`;
                            const deleteId = `delete-${optidx}`;
                            return (
                              <Box key={`input-${optidx}`} sx={{ my: 0 }}>
                                <Grid container display="flex" sx={{ pb: 1 }}>
                                  <Grid item xs>
                                    <Controls.TextField
                                      label={`Option ${optidx + 1}`} // Typography label
                                      type="text"
                                      name={`option-${optidx + 1}`}
                                      placeholder={`Option ${optidx + 1} for Question #${qstidx + 1}`}
                                      data-idx={optidx}
                                      id={`${optidx}`}
                                      fullWidth
                                      className="option"
                                      value={inputState[qstidx].options[optidx]}
                                      onChange={(e) => handleOptionChange(qstidx, optidx, e)}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <IconButton
                                      type="button"
                                      onClick={() => removeOption(qstidx, optidx)}
                                      id={`${optidx}`}
                                    >
                                      <Close />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </Box>
                            );
                          })
                        }
                        <Button
                          type="button"
                          onClick={() => addOption(qstidx)}
                          variant="contained"
                          color="secondary"
                          sx={{ m: 1, pr: 3 }}
                          startIcon={<Plus />}
                        >
                          Add Option
                        </Button>
                      </Box>
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
            variant="outlined"
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
        </Form>
      </Formik >

      {
        formPreview ? (
          <div>
            <br />
            <br />
            <Paper mt={4} elevation={3}>
              <Box p={4}>
                <FormSubmission formDesign={formPreview} displaySubmitButton={false} />
              </Box>
            </Paper>
          </div >
        ) : null
      }
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </>
  );
};

FormCreate.propTypes = {
  duplicateForm: PropTypes.bool,
  handleListRefresh: PropTypes.func,
};

export default FormCreate;
