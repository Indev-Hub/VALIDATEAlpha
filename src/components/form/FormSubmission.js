import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Controls from './controls/_controls';

const FormSubmission = props => {
  // Destructure formDesign (=FormCreate form object) and other props
  const { formDesign, displaySubmitButton = true } = props;

  // Format structure for form submission
  const submitStructure = {
    formID: formDesign.id,
    answers: {},
  };

  for (let i = 0; i < formDesign.validations.length; i++) {
    submitStructure.answers[`q${i + 1}`] = {
      question: formDesign.validations[i].question,
      answer: '',
    }
  };

  // Create intial field values (answer types) for Formik
  const initialValues = {};
  formDesign.validations.forEach((input, index) => {
    const name = `q${index + 1}`
    if (input.type === 'Checkbox') {
      initialValues[name] = [];
    } else if (input.type === 'Rating') {
      initialValues[name] = 0;
    } else {
      initialValues[name] = '';
    };
  });

  // Create Formik/Yup validation schema
  const validationSchema = {};
  formDesign.validations.forEach((input, index) => {
    const name = `q${index + 1}`
    if (input.type === 'Checkbox') {
      validationSchema[name] = Yup.array()
        .min(1, 'Please select one or more items.');
    } else if (input.type === 'Rating') {
      validationSchema[name] = Yup.number()
        .moreThan(0, 'Please rate this item.')
    } else {
      validationSchema[name] = Yup.string().required('Required');
    };
  });

  return (
    <>
      <h2>{formDesign.name}</h2>
      <h3>{formDesign.description}</h3>

      <Formik
        initialValues={{
          ...initialValues
        }}
        validationSchema={Yup.object({
          ...validationSchema
        })}

        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            // Add user input values into Q&A submission structure
            let formSubmission = { ...submitStructure };
            Object.keys(formSubmission.answers).forEach(questionNum => {
              formSubmission.answers[questionNum]['answer'] = values[questionNum];
            });
            // Stringify 'answers' collection for single DynamoDB field
            formSubmission.answers = JSON.stringify(formSubmission.answers)
            // Preview output
            alert(JSON.stringify(formSubmission, null, 2));

            setSubmitting(false);
          }, 400);
          // // POST to DynamoDB
          // await API.graphql(graphqlOperation(
          //   createFormSubmission,
          //   { input: formSubmission }
          // ))
        }}
      >
        <Form autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {formDesign.validations.map((question, index) => {
                if (question.type === "Checkbox") {
                  return (
                    <Controls.Checkbox
                      key={index}
                      label={question.question}
                      name={`q${index + 1}`}
                      options={question.option}
                    />
                  )
                }
                if (question.type === "Radio Group") {
                  return (
                    <Controls.RadioGroup
                      key={index}
                      label={question.question}
                      name={`q${index + 1}`}
                      options={question.option}
                    />
                  )
                }
                if (question.type === "Rating") {
                  return (
                    <Controls.Rating
                      key={index}
                      label={question.question}
                      name={`q${index + 1}`}
                    />
                  )
                }
                if (question.type === "Dropdown") {
                  return (
                    <Controls.Select
                      key={index}
                      label={question.question}
                      name={`q${index + 1}`}
                      options={question.option}
                    />
                  )
                }
                if (question.type === "Text Input") {
                  return (
                    <Controls.TextField
                      key={index}
                      label={question.question}
                      name={`q${index + 1}`}
                      type="text"
                      placeholder="Type your answer"
                    />
                  )
                }
              })
              }
              {displaySubmitButton ? (
                <Controls.Button type="submit" text="Submit" />
              ) : null}
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </>
  );
};

export default FormSubmission;
