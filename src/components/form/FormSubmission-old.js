import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createFormSubmission } from '../../graphql/mutations';
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

  // De-stringify "validations" single-field dataset
  const questions = JSON.parse(formDesign.validations);

  // Add question-answer pair, with question value, for each set of answers
  for (let i = 0; i < questions.length; i++) {
    submitStructure.answers[`q${i + 1}`] = {
      question: questions[i].question,
      answer: '',
    }
  };

  // Create initial field values (answer types) for Formik
  const initialValues = {};
  questions.forEach((input, index) => {
    const name = `q${index + 1}`
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
  questions.forEach((input, index) => {
    const name = `q${index + 1}`
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
      <h2>{formDesign.title}</h2>
      <h3>{formDesign.description}</h3>

      <Formik
        initialValues={{
          ...initialValues
        }}
        validationSchema={Yup.object({
          ...validationSchema
        })}

        onSubmit={async (values, { setSubmitting }) => {
          // Add user input values into question-answer submission structure
          let formSubmission = { ...submitStructure };
          Object.keys(formSubmission.answers).forEach(questionNum => {
            formSubmission.answers[questionNum]['answer'] = values[questionNum];
          });

          // // Preview output via window alert and console
          alert(JSON.stringify(formSubmission, null, 2));


          // Stringify 'answers' collection for single DynamoDB field
          formSubmission.answers = JSON.stringify(formSubmission.answers);

          console.log(
            'formSubmission:',
            JSON.stringify(formSubmission, null, 2)
          );

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
              {questions.map((question, index) => {
                switch (question.type) {
                  case 'Checkbox':
                    return (
                      <Controls.Checkbox
                        key={index}
                        id={`q${index + 1}`}
                        name={`q${index + 1}`}
                        altlabel={question.question}
                        options={question.options}
                      />
                    );
                    break;
                  case 'Dropdown':
                    return (
                      <Controls.Select
                        key={index}
                        id={`q${index + 1}`}
                        name={`q${index + 1}`}
                        altlabel={question.question}
                        options={question.options}
                      />
                    );
                    break;
                  case 'Number':
                    return (
                      <Controls.TextField
                        key={index}
                        id={`q${index + 1}`}
                        name={`q${index + 1}`}
                        altlabel={question.question}
                        type="number"
                        placeholder="Enter a number"
                      />
                    );
                    break;
                  case 'Radio Group':
                    return (
                      <Controls.RadioGroup
                        key={index}
                        id={`q${index + 1}`}
                        name={`q${index + 1}`}
                        altlabel={question.question}
                        options={question.options}
                      />
                    );
                    break;
                  case 'Rating':
                    return (
                      <Controls.Rating
                        key={index}
                        id={`q${index + 1}`}
                        name={`q${index + 1}`}
                        altlabel={question.question}
                      />
                    );
                    break;
                  case 'Switch':
                    return (
                      <Controls.Switch
                        key={index}
                        id={`q${index + 1}`}
                        name={`q${index + 1}`}
                        altlabel={question.question}
                        label={question.options}
                      />
                    );
                    break;
                  case 'Text Input':
                    return (
                      <Controls.TextField
                        key={index}
                        id={`q${index + 1}`}
                        name={`q${index + 1}`}
                        altlabel={question.question}
                        type="text"
                        placeholder="Type your answer"
                      />
                    );
                    break;
                  default:
                    return (
                      <div key={index}>
                        <h3>Unable to match answer type '{question.type}'.</h3>
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
