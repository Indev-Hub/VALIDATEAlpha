import React, { useRef, useState } from 'react';
import {
  Box, Button, Card, FormControlLabel, Grid, IconButton,
  Switch, Typography, Tooltip, Zoom, Paper,
} from '@material-ui/core';
import { Close, DeleteForever, Delete } from '@material-ui/icons';
import { Plus } from '../../../icons';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Controls from '../../form/controls/_controls';
import { INPUT_CONTROLS } from './FormConstants';

// VALIDATION QUESTIONS SECTION OF FormCreate

const FormQuestions = (props) => {
  // Deconstruct state props from FormCreate
  const {
    formId,
    questionsState,
    setQuestionsState,
    blankQuestion,
    previewForm,
    formImages,
    setFormImages,
  } = props;

  const fileInput = useRef();

  // Set static question ID for use in FormSubmission and AnalyticsSubmissions
  const [questionId, setQuestionId] = useState(1);

  // Add question to form and add the new question to questionsState array
  const addQuestion = () => {
    const newId = questionId + 1;
    setQuestionId(newId);
    setQuestionsState([
      ...questionsState,
      { ...blankQuestion, questionId: newId },
    ]);
  };

  // Remove question from mapped array
  const removeQuestion = (qstidx) => {
    const updatedState = [...questionsState]; // make copy
    const updatedImageIdx = { ...formImages }; // make copy
    delete updatedImageIdx[qstidx];
    updatedState.splice(qstidx, 1);
    const imageValues = Object.values(updatedImageIdx);
    const newImageKeys = Object.assign({}, imageValues);
    setFormImages(newImageKeys);
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

  // Update answer type when selected
  const handleRandomChange = (qstidx, e) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].randomize = e.target.checked;
    setQuestionsState(updatedState);
  };

  // Add answer option to form and add the new option to our questionsState
  const addOption = (qstidx) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].options = [...updatedState[qstidx].options, ''];
    setQuestionsState(updatedState);
  };

  // Update options for Image answer type after image files are selected;
  const updateImageOptions = (qstidx, imgUrlArray) => {
    const updatedState = [...questionsState];
    const currentStartingValue = updatedState[qstidx].options[0];
    if (currentStartingValue === '') {
      updatedState[qstidx].options.splice(0, 1);
    }
    updatedState[qstidx].options = [
      ...updatedState[qstidx].options,
      ...imgUrlArray,
    ];
    setQuestionsState(updatedState);
  };

  // Remove answer option from mapped array
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

  const removeImage = (qstidx, imgidx) => {
    const updatedFilesState = { ...formImages }; // make copy
    const updatedQuestionsState = [...questionsState]; // make copy
    if (updatedFilesState[qstidx].length === 1) {
      delete updatedFilesState[qstidx];
      updatedQuestionsState[qstidx].options = [''];
      setQuestionsState(updatedQuestionsState);
      setFormImages(updatedFilesState);
    } else {
      updatedFilesState[qstidx].splice(imgidx, 1);
      updatedQuestionsState[qstidx].options.splice(imgidx, 1);
      setFormImages(updatedFilesState);
      setQuestionsState(updatedQuestionsState);
    }
  };

  // ADD IMAGES ANSWER OPTIONS
  // Get selected image files and add file, path, or blob to associated state
  const imageStateUpdate = (e, qstidx) => {
    if (e.target.files) {
      let images = e.target.files;
      let imagePaths = [];
      let imageCollection = [];

      Object.values(images).forEach((image) => {
        // Create unique filename for S3 path to avoid name collisions
        // 'formId' used in FormCollection to delete S3 images with form
        // '/image-' used in AnalyticsGraphBar to identify image answer options
        const path = `${formId}/image-${uuidv4()}_${image.name}`;
        imagePaths.push(path);
        // Create blob URL for thumbnail render
        const imageThumbnail = URL.createObjectURL(image);
        imageCollection.push([path, image, imageThumbnail]);
      });

      // Checks for prior images before adding more images to qst array
      const previousImages = formImages[qstidx] ? formImages[qstidx] : [];

      setFormImages({
        ...formImages,
        [qstidx]: [...previousImages, ...imageCollection],
      });
      updateImageOptions(qstidx, imagePaths);
    }
  };

  const renderImages = (selectedImages, qstidx) => {
    if (selectedImages) {
      return selectedImages.map((image, imgidx) => {
        return (
          <Tooltip
            title={<Delete />}
            arrow
            placement='top'
            TransitionComponent={Zoom}
          >
            <Paper
              sx={{
                width: 80,
                height: 80,
                marginLeft: 2.25,
                marginBottom: 1,
                opacity: 1,
                '&:hover': {
                  opacity: 0.5,
                  cursor: 'pointer',
                },
              }}
            >
              <img
                pointerEvent='auto'
                src={image[2]}
                width={80}
                height={80}
                style={{
                  objectFit: 'cover',
                  borderRadius: 15,
                }}
                alt=''
                onClick={() => removeImage(qstidx, imgidx)}
              />
            </Paper>
          </Tooltip>
        );
      });
    }
  };

  return (
    <>
      {questionsState.map((_qst, qstidx) => {
        const qstId = `question-${qstidx}`;
        const typeId = `type-${qstidx}`;
        return (
          <Card key={`input-${qstidx}`} sx={{ my: 1 }}>
            <Grid
              container
              display='flex'
              sx={{
                backgroundColor: 'black',
                p: 1,
                color: 'white',
              }}
            >
              <Grid item justifyContent='center' xs={10} sm={11}>
                <Typography variant='h6' fullWidth align='center'>
                  {`Question ${qstidx + 1}`}
                </Typography>
              </Grid>
              <Grid item justifyContent='center' xs={2} sm={1}>
                <Button
                  type='button'
                  id={`${qstidx}`}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.light',
                    },
                  }}
                  onClick={() => removeQuestion(qstidx)}
                >
                  <DeleteForever />
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1} display='flex' sx={{ p: 2 }} row='true'>
              <Grid item xs={12} md={4}>
                <Box>
                  <Controls.TextField
                    label='Question'
                    type='text'
                    name={qstId}
                    placeholder={`Question #${qstidx + 1}`}
                    data-idx={qstidx}
                    id='question'
                    className='question'
                    fullWidth
                    multiline={false}
                    value={questionsState[qstidx].question}
                    onChange={(e) => handleQuestionInput(qstidx, e)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  <Controls.Select
                    label='Answer Type'
                    name={typeId}
                    inputlabel={`Question #${qstidx + 1} Answer Type`}
                    data-idx={qstidx}
                    id='type'
                    className='type'
                    value={questionsState[qstidx].type}
                    options={INPUT_CONTROLS}
                    onChange={(e) => handleSelectChange(qstidx, e)}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        value={questionsState[qstidx].randomize}
                        onChange={(e) => handleRandomChange(qstidx, e)}
                        name='randomizeOptions'
                      />
                    }
                    label='Randomize answers'
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  {/* Map through answer options, alternate text or images */}
                  {questionsState[qstidx].type !== 'Images' ? (
                    <>
                      {questionsState[qstidx].options.map((_opt, optidx) => {
                        return (
                          <Box key={`input-${optidx}`} sx={{ my: 0 }}>
                            <Grid container display='flex' sx={{ pb: 1 }}>
                              <Grid item xs>
                                <Controls.TextField
                                  label={`Option ${optidx + 1}`}
                                  type='text'
                                  name={`option-${optidx + 1}`}
                                  placeholder={`Option ${optidx +
                                    1} for Question #${qstidx + 1}`}
                                  data-idx={optidx}
                                  id={`${optidx}`}
                                  fullWidth
                                  className='option'
                                  value={questionsState[qstidx].options[optidx]}
                                  onChange={(e) =>
                                    handleOptionInput(qstidx, optidx, e)
                                  }
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <IconButton
                                  type='button'
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
                        type='button'
                        onClick={() => addOption(qstidx)}
                        variant='contained'
                        color='secondary'
                        sx={{ m: 1, pr: 3 }}
                        startIcon={<Plus />}
                      >
                        Add Option
                      </Button>
                    </>
                  ) : (
                    <>
                      <Grid
                        container
                        direction='row'
                        justifyContent='flex-start'
                        alignItems='flex-start'
                      >
                        {renderImages(formImages[qstidx], qstidx)}
                        <Button
                          type='button'
                          variant='contained'
                          component='label'
                          color='secondary'
                          sx={{
                            m: 1,
                            width: '100%',
                          }}
                          startIcon={<Plus />}
                        >
                          <input
                            type='file'
                            accept='image/png, image/gif, image/jpeg'
                            id='file'
                            ref={fileInput}
                            multiple
                            onChange={(e) => imageStateUpdate(e, qstidx)}
                            hidden
                          />
                          {formImages[qstidx]
                            ? 'Add Additional Images'
                            : 'Upload Images'}
                        </Button>
                      </Grid>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Card>
        );
      })}
      <Button
        type='button'
        onClick={addQuestion}
        variant='contained'
        color='secondary'
        sx={{ m: 1, pr: 3 }}
        startIcon={<Plus />}
      >
        Add Validation
      </Button>
      <Button
        type='button'
        onClick={previewForm}
        variant='outlined'
        color='secondary'
        sx={{ m: 1, pr: 3 }}
      >
        Preview Form
      </Button>
    </>
  );
};

FormQuestions.propTypes = {
  formId: PropTypes.string,
  questionsState: PropTypes.array,
  setQuestionsState: PropTypes.func,
  blankQuestion: PropTypes.object,
  previewForm: PropTypes.func,
  formImages: PropTypes.object,
  setFormImages: PropTypes.func,
};

export default FormQuestions;
