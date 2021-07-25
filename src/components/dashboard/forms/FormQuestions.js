import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography,
} from '@material-ui/core';
import { Close, DeleteForever } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { Plus } from '../../../icons';
import Controls from '../../form/controls/_controls';
import FileDropzone from 'src/components/FileDropzone';

// VALIDATION QUESTIONS SECTION OF FormCreate.js

const INPUT_CONTROLS = [
  'Checkbox',
  'Dropdown',
  'Number',
  'Radio Group',
  'Radio Images',
  'Rating',
  'Switch',
  'Text Input',
];

const FormQuestions = props => {
  // Deconstruct state props from FormCreate.js
  const {
    questionsState,
    setQuestionsState,
    blankQuestion,
    previewForm,
    uploadForm,
  } = props;

  // Add question to form and add the new question to questionsState array
  const addQuestion = () => {
    setQuestionsState([...questionsState, { ...blankQuestion }]);
  };

  // Remove question from mapped array
  const removeQuestion = (qstidx) => {
    const updatedState = [...questionsState]; // make copy
    updatedState.splice(qstidx, 1);
    setQuestionsState(updatedState);
  };

  // Update question portion of form every time a field is modified
  const handleQuestionInput = (qstidx, e) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].question = e.target.value;
    setQuestionsState(updatedState);
  };

  // Update answer type when selected
  const handleSelectChange = (qstidx, e) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].type = e.target.value;
    setQuestionsState(updatedState);
  };

  // Add answer option to form and add the new option to our questionsState
  const addOption = (qstidx) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].options = [...updatedState[qstidx].options, '']
    setQuestionsState(updatedState);
  };

  // Removes answer option from mapped array.
  const removeOption = (qstidx, optidx) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].options.splice(optidx, 1);
    setQuestionsState(updatedState);
  };

  // Update answer option portion of form every time a field is modified
  const handleOptionInput = (qstidx, optidx, e) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].options[optidx] = e.target.value;
    setQuestionsState(updatedState);
  };

  // vv  UPLOAD IMAGES  vv
  // Set images state
  const [images, setImages] = useState([]);

  // Set new images state when items are dropped into dropzone
  const handleDrop = (newImages) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Remove specific image from dropzone
  const handleRemove = (file) => {
    setImages((prevImages) => prevImages.filter((_file) => _file.path
      !== file.path));
  };

  // Remove all images from dropzone
  const handleRemoveAll = () => {
    setImages([]);
  };

  // Sets whether images are being added to options and displays dropzone if true
  const [isImage, setIsImage] = useState([]);

  // Update image state array
  const toggleImages = async (qstidx) => {
    // Check if the current index already exists in the array
    if (isImage.includes(qstidx)) {
      // Duplicate existing isImage array and return only the items that DO NOT match the current index.
      // When setIsImage operates below it effectively removes the current index from the array.
      const removeImageOption = isImage.filter(items => { return items !== qstidx });
      
      // Replace isImage array with modified array (without current index)
      setIsImage(removeImageOption);
      console.log('image check true:', isImage, qstidx) // Can be removed if everything is understood and working correctly
      return;
    }

    // If the above "if" check comes back false then we add the index to the isImage array
    setIsImage([
      ...isImage,
      qstidx
    ]);
    console.log('image check false:', isImage, qstidx) // Can be removed if everything is understood and working correctly
  };

  return (
    <React.Fragment>
      {questionsState.map((_qst, qstidx) => {
        const questionId = `question-${qstidx}`;
        const typeId = `type-${qstidx}`;
        return (
          <Card key={`input-${qstidx}`} sx={{ my: 1 }}>
            <Grid
              container
              display="flex"
              sx={{
                backgroundColor: 'black',
                p: 1,
                color: 'white'
              }}
            >
              <Grid item justifyContent="center" xs={10} md={11}>
                <Typography
                  variant="h6"
                  fullWidth
                  align='center'
                >
                  {`Question ${qstidx + 1}`}
                </Typography>
              </Grid>
              <Grid item justifyContent="center" xs={1} md={1}>
                <Button
                  type="button"
                  id={`${qstidx}`}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.light'
                    }
                  }}
                  onClick={() => removeQuestion(qstidx)}
                >
                  <DeleteForever />
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={1}
              display="flex"
              sx={{ p: 2 }}
              row="true"
            >
              <Grid item xs={12} md={4}>
                <Box>
                  <Controls.TextField
                    label="Question"
                    type="text"
                    name={questionId}
                    placeholder={`Question #${qstidx + 1}`}
                    data-idx={qstidx}
                    id="question"
                    className="question"
                    fullWidth
                    value={questionsState[qstidx].question}
                    onChange={(e) => handleQuestionInput(qstidx, e)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Controls.Select
                    label="Answer Type"
                    name={typeId}
                    inputlabel={`Question #${qstidx + 1} Answer Type`}
                    data-idx={qstidx}
                    id="type"
                    className="type"
                    value={questionsState[qstidx].type}
                    options={INPUT_CONTROLS}
                    onChange={(e) => handleSelectChange(qstidx, e)}
                  />
                    <FormControlLabel
                      control={<Switch onClick={() => toggleImages(qstidx)} name="useImages" />}
                      label="Use images as answers"

                    />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  {isImage.includes(qstidx) ?
                    (
                      <Box mb={1}>
                        <FileDropzone
                          accept="image/*"
                          files={images}
                          onDrop={handleDrop}
                          onRemove={handleRemove}
                          onRemoveAll={handleRemoveAll}
                        />
                      </Box>                        
                    ) : (
                      null
                    )
                  }
                  {/* Start mapping the validation answer options */}
                  {questionsState[qstidx].options.map((_opt, optidx) => {
                    return (
                      <Box key={`input-${optidx}`} sx={{ my: 0 }}>
                        <Grid container display="flex" sx={{ pb: 1 }}>
                          <Grid item xs>
                            <Controls.TextField
                              label={`Option ${optidx + 1}`}
                              type="text"
                              name={`option-${optidx + 1}`}
                              placeholder={`Option ${optidx + 1} for Question #${qstidx + 1}`}
                              data-idx={optidx}
                              id={`${optidx}`}
                              fullWidth
                              className="option"
                              value={questionsState[qstidx].options[optidx]}
                              onChange={(e) => handleOptionInput(qstidx, optidx, e)}
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
                  })}
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
      })}
      <Button
        type="button"
        onClick={addQuestion}
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
    </React.Fragment>
  );
};

FormQuestions.propTypes = {
  questionsState: PropTypes.array,
  setQuestionsState: PropTypes.func,
  blankQuestion: PropTypes.object,
  previewForm: PropTypes.func,
  uploadForm: PropTypes.func,
};

export default FormQuestions;
