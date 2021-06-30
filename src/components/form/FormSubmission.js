import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Controls from './controls/_controls';
// import formData from './testing/tempFormData';

// initialValues = {}
// for (let i = 1; i <= formData.validations.length; i++) {
//   initialValues[`q${i}`] = {question: "", answer: ""}  
// }

// setValues() {
//  q1.question = validate.question
//  q1.answer = values.q1
//  }

// // Initialize form field values
// const formDataInitialValues = {};
// const formDataValidation = {};

// formData.validations.forEach((validation, index) => {
//   // const name = `${formData.id}-q${index + 1}`
//   const name = `${index + 1}. ${validation.question}`
//   if (validation.type === 'Checkbox') {
//     formDataInitialValues[name] = [];
//   } else if (validation.type === 'Rating') {
//     formDataInitialValues[name] = 0;
//   } else {
//     formDataInitialValues[name] = '';
//   };
// });

// // Validate form response requirements
// formData.validations.forEach((validation, index) => {
//   // const name = `${formData.id}-q${index + 1}`
//   const name = `${validation.question}`
//   if (validation.type === 'Checkbox') {
//     formDataValidation[name] = Yup.array()
//       .min(1, 'Please select one or more items.');
//   } else if (validation.type === 'Rating') {
//     formDataValidation[name] = Yup.number()
//       .moreThan(0, 'Please rate this item.')
//   } else {
//     formDataValidation[name] = Yup.string().required('Required');
//   };
// });

// Generate a customized form from 'tempFormData'
const FormSubmission = props => {
  const { formData, displaySubmit = true } = props;

  const formDataStructured = {
    formID: formData.id,
    answers: {},
  };

  for (let i = 1; i <= formData.validations.length; i++) {
    formDataStructured.answers[`q${i}`] = {
      question: '',
      answer: '',
    }
  }

  // console.log('formDataStructured', formDataStructured)

  const [formDataState, setFormDataState] = useState(formDataStructured);

  // console.log('formDataStructured', formDataState)

  // Initialize form field values
  const formDataInitialValues = {};
  const formDataValidation = {};

  formData.validations.forEach((validation, index) => {
    // const name = `${formData.id}-q${index + 1}`
    const name = `${index + 1}. ${validation.question}`
    if (validation.type === 'Checkbox') {
      formDataInitialValues[name] = [];
    } else if (validation.type === 'Rating') {
      formDataInitialValues[name] = 0;
    } else {
      formDataInitialValues[name] = '';
    };
  });

  // Validate form response requirements
  formData.validations.forEach((validation, index) => {
    // const name = `${formData.id}-q${index + 1}`
    const name = `${validation.question}`
    if (validation.type === 'Checkbox') {
      formDataValidation[name] = Yup.array()
        .min(1, 'Please select one or more items.');
    } else if (validation.type === 'Rating') {
      formDataValidation[name] = Yup.number()
        .moreThan(0, 'Please rate this item.')
    } else {
      formDataValidation[name] = Yup.string().required('Required');
    };
  });

  return (
    <>
      <h2>{formData.name}</h2>
      <h3>{formData.description}</h3>

      <Formik
        initialValues={{
          ...formDataInitialValues
        }}
        validationSchema={Yup.object({
          ...formDataValidation
        })}

        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            const responseData = {
              formID: formData.id,
              answers: {
                q1: {
                  question: "How old are you?",
                  answer: 24
                },
                q2: {
                  question: "Where are you?",
                  answer: "Here"
                }
              },
            }
            alert(JSON.stringify(responseData, null, 2));
            setSubmitting(false);
          }, 400);
          // onSubmit={async (values, { setSubmitting }) => {
          //   setTimeout(() => {
          //     const submissionData = {
          //       formID: formData.id,
          //       answers: JSON.stringify({ ...values }),
          //     }
          //     await API.graphql(graphqlOperation(createFormSubmission, { input: submissionData }));
          //     setSubmitting(false);
          //   }, 400);
        }}
      >
        <Form autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {formData.validations.map((validation, index) => {
                if (validation.type === "Checkbox") {
                  // const questionNumber = `q${index + 1}`;
                  // setFormDataState({
                  //   ...formDataState, 
                  //   [answers.questionNumber]: validation.question
                  // })
                  return (
                    <Controls.Checkbox
                      key={index}
                      question={validation.question}
                      // name={`${formData.id}-q${index + 1}`}
                      name={`${validation.question}`}
                      options={validation.option}
                    />
                  )
                }
                if (validation.type === "Radio Group") {
                  return (
                    <Controls.RadioGroup
                      key={index}
                      question={validation.question}
                      // name={`${formData.id}-q${index + 1}`}
                      name={`${validation.question}`}
                      options={validation.option}
                    />
                  )
                }
                if (validation.type === "Rating") {
                  return (
                    <Controls.Rating
                      key={index}
                      question={validation.question}
                      // name={`${formData.id}-q${index + 1}`}
                      name={`${validation.question}`}
                    />
                  )
                }
                if (validation.type === "Dropdown") {
                  return (
                    <Controls.Select
                      key={index}
                      question={validation.question}
                      // name={`${formData.id}-q${index + 1}`}
                      name={`${validation.question}`}
                      options={validation.option}
                    />
                  )
                }
                if (validation.type === "Text Input") {
                  return (
                    <Controls.TextField
                      key={index}
                      question={validation.question}
                      // name={`${formData.id}-q${index + 1}`}
                      name={`${validation.question}`}
                      type="text"
                      placeholder="Type your answer"
                    />
                  )
                }
              })
              }
              {displaySubmit ? (
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
