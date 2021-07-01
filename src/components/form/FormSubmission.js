import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Controls from './controls/_controls';

// Generate a customized form from 'tempFormData'
const FormSubmission = props => {
  // Destructure props passed from pages rendering this component
  const { formDesign, displaySubmitButton = true } = props;

  // Format form submission structure
  const formSubmit = {
    formID: formDesign.id,
    answers: {},
  };

  for (let i = 1; i <= formDesign.validations.length; i++) {
    formSubmit.answers[`q${i}`] = {
      question: '',
      answer: '',
    }
  };

  // // Set-up useState for form data
  // const [formState, setFormState] = useState(formSubmit);

  // // Change formState when component rendered 
  // // ** This was removed from each control conditional in return() below **
  // // ** because it appears to be causing an infinite loop. **
  // setFormState({
  //   ...formState,
  //   answers: {
  //     [`q${index + 1}`]: {
  //       ...formState.answers[`q${index + 1}`],
  //       question: input.question
  //     }
  //   }
  // })

  // // Merge input values with rest of form submission structure
  // const formSubmitMergeInput = (values) => {
  //   Object.keys(values).forEach(questionNum => {
  //     setFormState({
  //       ...formState,
  //       answers: {
  //         [questionNum]: {
  //           ...formState.answers[questionNum],
  //           answer: values[questionNum]
  //         }
  //       }
  //     })
  //   });
  // };

  const formSubmitMergeInput = (values) => {
    Object.keys(formSubmit.answers).forEach(questionNum => {
      formSubmit.answers[questionNum]['answer'] = values[questionNum];
    });
  };

  // Create Formik intial field values (answer types)
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

  // Create Formik validation schema
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
            console.log('values:', values);
            formSubmitMergeInput(values);
            alert(JSON.stringify(formSubmit, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        <Form autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {formDesign.validations.map((input, index) => {
                if (input.type === "Checkbox") {
                  formSubmit.answers[`q${index + 1}`]['question'] = input.question;
                  return (
                    <Controls.Checkbox
                      key={index}
                      question={input.question}
                      name={`q${index + 1}`}
                      options={input.option}
                    />
                  )
                }
                if (input.type === "Radio Group") {
                  formSubmit.answers[`q${index + 1}`]['question'] = input.question;
                  return (
                    <Controls.RadioGroup
                      key={index}
                      question={input.question}
                      name={`q${index + 1}`}
                      options={input.option}
                    />
                  )
                }
                if (input.type === "Rating") {
                  formSubmit.answers[`q${index + 1}`]['question'] = input.question;
                  return (
                    <Controls.Rating
                      key={index}
                      question={input.question}
                      name={`q${index + 1}`}
                    />
                  )
                }
                if (input.type === "Dropdown") {
                  formSubmit.answers[`q${index + 1}`]['question'] = input.question;
                  return (
                    <Controls.Select
                      key={index}
                      question={input.question}
                      name={`q${index + 1}`}
                      options={input.option}
                    />
                  )
                }
                if (input.type === "Text Input") {
                  formSubmit.answers[`q${index + 1}`]['question'] = input.question;
                  return (
                    <Controls.TextField
                      key={index}
                      question={input.question}
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
