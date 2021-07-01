import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createFormSubmission } from 'src/graphql/mutations';
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
    <React.Fragment>
      <h2>{formDesign.name}</h2>
      <h3>{formDesign.description}</h3>

      <Formik
        initialValues={{
          ...initialValues
        }}
        validationSchema={Yup.object({
          ...validationSchema
        })}

        onSubmit={async (values, { setSubmitting }) => {
          // Add user input values into Q&A submission structure
          let formSubmission = { ...submitStructure };
          Object.keys(formSubmission.answers).forEach(questionNum => {
            formSubmission.answers[questionNum]['answer'] = values[questionNum];
          });

          // Preview output via window alert and console
          alert(JSON.stringify(formSubmission, null, 2));
          console.log('formSubmission:', formSubmission)

          // Stringify 'answers' collection for single DynamoDB field
          formSubmission.answers = JSON.stringify(formSubmission.answers)

          // // POST to DynamoDB
          // await API.graphql(graphqlOperation(
          //   createFormSubmission,
          //   { input: formSubmission }
          // ));

          setSubmitting(false);
        }}
      >
        <Form autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {formDesign.validations.map((question, index) => {
                switch (question.type) {
                  case 'Checkbox':
                    return (
                      <Controls.Checkbox
                        key={index}
                        label={question.question}
                        name={`q${index + 1}`}
                        options={question.option}
                      />
                    );
                    break;
                  case 'Radio Group':
                    return (
                      <Controls.RadioGroup
                        key={index}
                        label={question.question}
                        name={`q${index + 1}`}
                        options={question.option}
                      />
                    );
                    break;
                  case 'Rating':
                    return (
                      <Controls.Rating
                        key={index}
                        label={question.question}
                        name={`q${index + 1}`}
                      />
                    );
                    break;
                  case 'Dropdown':
                    return (
                      <Controls.Select
                        key={index}
                        label={question.question}
                        name={`q${index + 1}`}
                        options={question.option}
                      />
                    );
                    break;
                  case 'Text Input':
                    return (
                      <Controls.TextField
                        key={index}
                        label={question.question}
                        name={`q${index + 1}`}
                        type="text"
                        placeholder="Type your answer"
                      />
                    );
                    break;
                  default:
                    return (
                      <div>
                        <h3>Unable to match form type '{question.type}'.</h3>
                      </div>
                    );
                }
              })}
              {displaySubmitButton ? (
                <Controls.Button type="submit" text="Submit" />
              ) : null}
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </React.Fragment>
  );
};

export default FormSubmission;
