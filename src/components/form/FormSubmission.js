import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { createFormSubmission } from '../../graphql/mutations';
import { Alert, Box, Card, Grid, Typography } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import Controls from './controls/_controls';
import Notification from './Notification';

const FormSubmission = props => {
  const navigate = useNavigate();

  // Destructure formDesign (=FormCreate form object) and other props
  const { formDesign, userData, displaySubmitButton = true } = props;

  // Form Design variables
  const marginUp = 2;

  // Set state of upload success and failure notifications
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: ''
  })

  // Format structure for form submission
  const submitStructure = {
    formID: formDesign.id,
    answers: {},
  };

  // De-stringify "validations" single-field dataset
  const questions = JSON.parse(formDesign.validations);

  // Add question-answer pair, with question value, for each set of answers
  for (let i = 0; i < questions.length; i++) {
    submitStructure.answers[questions[i].questionId] = {
      question: questions[i].question,
      answerType: questions[i].type,
      answer: '',
    }
  };

  // Randomize options for display
  const randomizeOptions = (index) => {
    let rando = questions[index].options;
    const randoSort = rando.sort(() => Math.random() - 0.5);
    console.log('Random Array Sorting:', randoSort);
    return randoSort;
  }

  // Create initial field values (answer types) for Formik
  const initialValues = {};
  questions.forEach(input => {
    const name = `q${input.questionId}`
    if (input.type === 'Checkbox') {
      initialValues[name] = [];
    } else if (input.type === 'Rating') {
      initialValues[name] = 0;
    } else if (input.type === 'Switch') {
      initialValues[name] = false;
    } else {
      initialValues[name] = '';
    };
  });

  // Create Formik/Yup validation schema
  const validationSchema = {};
  questions.forEach(input => {
    const name = `q${input.questionId}`
    if (input.type === 'Checkbox') {
      validationSchema[name] = Yup.array()
        .min(1, 'Please select one or more items.');
    } else if (input.type === 'Rating') {
      validationSchema[name] = Yup.number()
        .moreThan(0, 'Please rate this item.')
    } else if (input.type === 'Switch') {
      validationSchema[name] = Yup.boolean().required('Required');
    } else {
      validationSchema[name] = Yup.string().required('Required');
    };
  });

  return (
    <React.Fragment>
      <Grid
        container
        display="column"
        justifyContent="center"
        spacing={2}
        xs={11}
        md={10}
        lg={10}
        mx='auto'
        my={2}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 4,
              width: '100%'
            }}
          >
            <Typography variant="h4">{formDesign.title}</Typography>
            <Typography>{formDesign.companyName}</Typography>
            <Typography pt={2}>{formDesign.description}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 4,
              width: '100%'
            }}
          >
            <Formik
              initialValues={{
                ...initialValues
              }}
              validationSchema={Yup.object({
                ...validationSchema
              })}

              onSubmit={async (values, { setSubmitting }) => {
                // Add user input values into submission data structure
                let formSubmission = { ...submitStructure };
                Object.keys(formSubmission.answers).forEach(questionId => {
                  formSubmission.answers[questionId]['answer'] = values[`q${questionId}`];
                });

                // Stringify 'answers' collection for single DynamoDB field
                formSubmission.answers = JSON.stringify(formSubmission.answers);

                // Output form submission data structure to console
                // console.log(
                //   'formSubmission:',
                //   JSON.stringify(formSubmission, null, 2)
                // );

                // POST to DynamoDB
                try {
                  await API.graphql(graphqlOperation(
                    createFormSubmission,
                    { input: formSubmission }
                  ));
                  setNotify({
                    isOpen: true,
                    message: `Submitted Successfully`,
                    type: 'success'
                  });
                  setTimeout(() => navigate('/#form-search'), 1200);
                } catch (error) {
                  console.log('error submitting form', error);
                  setNotify({
                    isOpen: true,
                    message: `Submission Failed: ${error}`,
                    type: 'error'
                  });
                }
                setSubmitting(false);
              }}
            >
              <Form autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {questions.map((question, index) => {
                      switch (question.type) {
                        case 'Checkbox':
                          return (
                            <Box mt={marginUp}>
                              <Controls.Checkbox
                                key={index}
                                id={`q${question.questionId}`}
                                name={`q${question.questionId}`}
                                altlabel={question.question}
                                options={question.randomize ? randomizeOptions(index) : question.options}
                              />
                            </Box>
                          );
                          break;
                        case 'Dropdown':
                          return (
                            <Box mt={marginUp}>
                              <Controls.Select
                                key={index}
                                id={`q${question.questionId}`}
                                name={`q${question.questionId}`}
                                altlabel={question.question}
                                options={question.randomize ? randomizeOptions(index) : question.options}
                              />
                            </Box>
                          );
                          break;
                        case 'Number':
                          return (
                            <Box mt={marginUp}>
                              <Controls.TextField
                                key={index}
                                id={`q${question.questionId}`}
                                name={`q${question.questionId}`}
                                altlabel={question.question}
                                fullWidth
                                type="number"
                                placeholder="Enter a number"
                              />
                            </Box>
                          );
                          break;
                        case 'Radio Group':
                          return (
                            <Box mt={marginUp}>
                              <Controls.RadioGroup
                                key={index}
                                id={`q${question.questionId}`}
                                name={`q${question.questionId}`}
                                altlabel={question.question}
                                options={question.randomize ? randomizeOptions(index) : question.options}
                              />
                            </Box>
                          );
                          break;
                        case 'Images':
                          return (
                            <Box mt={marginUp}>
                              <Controls.RadioImages
                                key={index}
                                id={`q${question.questionId}`}
                                name={`q${question.questionId}`}
                                altlabel={question.question}
                                options={question.randomize ? randomizeOptions(index) : question.options}
                              />
                            </Box>
                          );
                          break;
                        case 'Rating':
                          return (
                            <Box mt={marginUp}>
                              <Controls.Rating
                                key={index}
                                id={`q${question.questionId}`}
                                name={`q${question.questionId}`}
                                altlabel={question.question}
                              />
                            </Box>
                          );
                          break;
                        case 'Switch':
                          return (
                            <Box mt={marginUp}>
                              <Controls.Switch
                                key={index}
                                id={`q${question.questionId}`}
                                name={`q${question.questionId}`}
                                altlabel={question.question}
                                label={question.options}
                              />
                            </Box>
                          );
                          break;
                        case 'Text Input':
                          return (
                            <Box mt={marginUp}>
                              <Controls.TextField
                                key={index}
                                id={`q${question.questionId}`}
                                name={`q${question.questionId}`}
                                altlabel={question.question}
                                type="text"
                                placeholder="Type your answer"
                              />
                            </Box>
                          );
                          break;
                        default:
                          return (
                            <Box key={index} mb={1}>
                              <Alert severity="error">Please select an answer type for this question</Alert>
                            </Box>
                          );
                      }
                    })}
                    {displaySubmitButton ? (
                      <Box mt={marginUp}>
                        <Controls.Button type="submit" text="Submit" />
                      </Box>
                    ) : null}
                  </Grid>
                </Grid>
              </Form>
            </Formik>
          </Card>
        </Grid>
      </Grid>
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </React.Fragment>
  );
};

FormSubmission.propTypes = {
  formDesign: PropTypes.object,
  displaySubmitButton: PropTypes.bool,
};

export default FormSubmission;
