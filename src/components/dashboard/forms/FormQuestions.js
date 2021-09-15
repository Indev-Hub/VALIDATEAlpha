import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography,
  Tooltip,
  Zoom,
  Paper
} from "@material-ui/core";
import { Close, DeleteForever, Delete } from "@material-ui/icons";
import PropTypes from "prop-types";
import { Plus } from "../../../icons";
import Controls from "../../form/controls/_controls";
import UploadMultiplePreview from "./UploadMultiplePreview";
import { INPUT_CONTROLS } from "./FormConstants";

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

  const fileInput = React.useRef();

  // Add question ID state for UploadMultiplePreview (RadioImages options)
  const [questionId, setQuestionId] = useState(1);
  console.log("questionsState", questionsState)

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
  // may have to delete the 'key' to remove images associated with index
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

  // Update answer type when selected
  const handleRandomChange = (qstidx, e) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].randomize = e.target.checked;
    setQuestionsState(updatedState);
  };

  // Add answer option to form and add the new option to our questionsState
  const addOption = (qstidx) => {
    const updatedState = [...questionsState]; // make copy
    updatedState[qstidx].options = [...updatedState[qstidx].options, ""];
    setQuestionsState(updatedState);
  };

  // Update options for Radio Images after image files are selected;
  const updateRadioImagesOptions = (qstidx, imgUrlArray) => {
    const updatedState = [...questionsState];
    updatedState[qstidx].options = [...imgUrlArray];
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

  const imageDelete = (qstidx, imgidx) => {
    const updatedFilesState = { ...formImages }; // make copy
    if (updatedFilesState[qstidx].length === 1) {
      updatedFilesState[qstidx].splice(imgidx, 1);
      delete updatedFilesState[qstidx]
      setFormImages(updatedFilesState)
      console.log('formImages', formImages);
    } else {
      updatedFilesState[qstidx].splice(imgidx, 1);
      setFormImages(updatedFilesState);
      console.log('formImages', formImages);
    }
  }

  // UPLOAD RADIO IMAGES ANSWER OPTIONS
  // Sets whether images are being added to options and displays dialog if true
  const [isImage, setIsImage] = useState([]);

  // Update isImage state to toggle UploadMultiplePreveiw dialog component
  const toggleImages = async (qstidx) => {
    // Remove if question index is already in state
    if (isImage.includes(qstidx)) {
      const removeImageOption = isImage.filter((items) => {
        return items !== qstidx;
      });
      setIsImage(removeImageOption);
      return;
    }
    // Otherwise, add the index to isImage state 
    setIsImage([...isImage, qstidx]);
  };

  const imageStateUpdate = (e, qstidx) => {
    if (e.target.files) {
      let images = e.target.files;
      let imagePath = [];
      let formCollection = [];

      Object.values(images).forEach((image, idx) => {
        const path = `${formId}/q${qstidx + 1}_a${idx + 1}_${image.name}`;
        const userFacingImage = URL.createObjectURL(image);
        imagePath.push(path);
        formCollection.push([path, image, userFacingImage]);
        console.log("path#", path);
      });

      const previouslyAddedImages = formImages[qstidx] ? formImages[qstidx] : [];
      setFormImages({
        ...formImages,
        [qstidx]: [...previouslyAddedImages, ...formCollection]
      });
      console.log("formImages#", formImages)
      updateRadioImagesOptions(qstidx, imagePath);
      toggleImages(qstidx);
    } else {
      console.log("formImages#", formImages)
    }
  };

  const renderPhotos = (source, qstidx) => {
    if (source) {
      return source.map((photo, imgidx) => {
        console.log("photo", photo)
        return (
          <Tooltip
            title={<Delete />}
            arrow
            placement="top"
            TransitionComponent={Zoom}
          >
            <Paper
              sx={{
                width: 80,
                height: 80,
                marginLeft: 2.25,
                marginBottom: 1,
                opacity: 1,
                "&:hover": {
                  opacity: 0.50,
                  cursor: "pointer",
                },
              }}
            >
              <img
                pointerEvent="auto"
                src={photo[2]}
                width={80}
                height={80}
                style={{
                  objectFit: "cover",
                  borderRadius: 15,
                }}
                alt=""
                onClick={() => imageDelete(qstidx, imgidx)}
              />
            </Paper>
          </Tooltip >
        );
      });
    }
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
                backgroundColor: "black",
                p: 1,
                color: "white",
              }}
            >
              <Grid item justifyContent="center" xs={10} sm={11}>
                <Typography variant="h6" fullWidth align="center">
                  {`Question ${qstidx + 1}`}
                </Typography>
              </Grid>
              <Grid item justifyContent="center" xs={2} sm={1}>
                <Button
                  type="button"
                  id={`${qstidx}`}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "text.light",
                    },
                  }}
                  onClick={() => removeQuestion(qstidx)}
                >
                  <DeleteForever />
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={1} display="flex" sx={{ p: 2 }} row="true">
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
                    multiline={false}
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
                    control={
                      <Switch
                        value={questionsState[qstidx].randomize}
                        onChange={(e) => handleRandomChange(qstidx, e)}
                        name="randomizeOptions"
                      />
                    }
                    label="Randomize answers"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box>
                  {/* Start mapping the validation answer options & alternate text and image upload */}
                  {questionsState[qstidx].type !== "Images" ? (
                    <>
                      {questionsState[qstidx].options.map((_opt, optidx) => {
                        return (
                          <Box key={`input-${optidx}`} sx={{ my: 0 }}>
                            <Grid container display="flex" sx={{ pb: 1 }}>
                              <Grid item xs>
                                <Controls.TextField
                                  label={`Option ${optidx + 1}`}
                                  type="text"
                                  name={`option-${optidx + 1}`}
                                  placeholder={`Option ${optidx +
                                    1} for Question #${qstidx + 1}`}
                                  data-idx={optidx}
                                  id={`${optidx}`}
                                  fullWidth
                                  className="option"
                                  value={questionsState[qstidx].options[optidx]}
                                  onChange={(e) =>
                                    handleOptionInput(qstidx, optidx, e)
                                  }
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
                    </>
                  ) : (
                    <>
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        {renderPhotos(formImages[qstidx], qstidx)}
                        <Button
                          type="button"
                          variant="contained"
                          component="label"
                          onClick={() => toggleImages(qstidx)}
                          color="secondary"
                          sx={{
                            m: 1,
                            width: "100%",
                          }}
                          startIcon={<Plus />}
                        >
                          <input
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            id="file"
                            ref={fileInput}
                            multiple
                            onChange={(e) => imageStateUpdate(e, qstidx)}
                            hidden
                          />
                          {formImages[qstidx] ?
                            ("Add Additional Images")
                            : ("Upload Images")
                          }
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
    </React.Fragment>
  );
};

FormQuestions.propTypes = {
  formId: PropTypes.string,
  questionsState: PropTypes.array,
  setQuestionsState: PropTypes.func,
  blankQuestion: PropTypes.object,
  previewForm: PropTypes.func,
  formImages: PropTypes.array,
  setFormImages: PropTypes.func,
};

export default FormQuestions;
