import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createForm } from '../../../graphql/mutations';
import { Formik, Form } from 'formik';
import { isNull, uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import { Box, Paper } from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import FormSubmission from '../../form/FormSubmission';
import Notification from '../../form/Notification';
import FormDetails from './FormDetails';
import FormQuestions from './FormQuestions';

const FormCreate = props => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // This is used if duplicating from existing form in TestList
  const { selectedForm = null, handleListRefresh } = props;

  // Set state of upload success and failure notifications
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: ''
  })

  // Initialize form details state
  let initialDetails;
  if (selectedForm) {
    // If duplicating from existing form
    initialDetails = {
      title: selectedForm.title,
      description: selectedForm.description,
      isPrivate: selectedForm.isPrivate,
      tags: JSON.parse(selectedForm.tags),
    }
  } else {
    initialDetails = {
      title: '',
      description: '',
      isPrivate: true,
      tags: [''],
    }
  };

  const [detailsState, setDetailsState] = useState(initialDetails);

  // Initialize questions state
  const blankQuestion = {
    question: '',
    type: '',
    options: [''],
  };

  let initialQuestions;
  if (selectedForm) {
    // If duplicating from existing form
    initialQuestions = JSON.parse(selectedForm.validations);
  } else {
    initialQuestions = [blankQuestion];
  }

  const [questionsState, setQuestionsState] = useState(initialQuestions);

  // Construct data object to be used as output for DB and prop for form preview
  const createFormDesignDataSet = () => {
    // Create random number for ID (temp solution for unique ID — will add company name and form number later on)
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Deconstruct form properties
    const { title, description, isPrivate, tags } = detailsState;
    const formID = getRandomInt(1000, 9999);
    const compID = getRandomInt(1000, 9999);

    // The input data to be sent in our createForm request 
    const formDesignDataSet = {
      id: `form-${formID}`,
      companyID: user.email, // to filter list; change to user.company once a companyID association has been made with user
      title: title,
      description: description,
      isPrivate: isPrivate,
      tags: JSON.stringify(tags),
      validations: JSON.stringify(questionsState),
    };

    return formDesignDataSet;
  };

  // Form preview
  const [formPreview, setFormPreview] = useState(null);
  const previewForm = () => {
    const formDesign = createFormDesignDataSet();
    setFormPreview(formDesign);
  };

  const uploadForm = async () => {
    // Get user attributes
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    const userName = signInUserSession.accessToken.payload.username;
    const userId = signInUserSession.accessToken.payload.sub

    // Get form design schema and output to DynamoDB
    const formDesignDataSet = createFormDesignDataSet();
    console.log('formDesign = ', JSON.stringify(formDesignDataSet, null, 2));
    try {
      await API.graphql(graphqlOperation(
        createForm, { input: formDesignDataSet }
      ));
      // Refresh if submitted from TestList page (i.e., starting from duplicate)
      // or redirect to TestList page if submitted from TestCreate route
      selectedForm ? handleListRefresh() : navigate("/dashboard/test-list");
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
    <React.Fragment>
      <Formik>
        <Form autoComplete="off">
          {/* Company details part of the form */}
          <FormDetails
            detailsState={detailsState}
            setDetailsState={setDetailsState}
          />
          {/* Start mapping the validation questions */}
          <FormQuestions
            questionsState={questionsState}
            setQuestionsState={setQuestionsState}
            blankQuestion={blankQuestion}
            previewForm={previewForm}
            uploadForm={uploadForm}
          />
        </Form>
      </Formik >

      {formPreview ? (
        <Paper elevation={3} sx={{ mt: 2 }}>
          <Box p={4}>
            <FormSubmission
              formDesign={formPreview}
              displaySubmitButton={false}
            />
          </Box>
        </Paper>
      ) : null}

      <Notification
        notify={notify}
        setNotify={setNotify}
      />
    </React.Fragment>
  );
};

FormCreate.propTypes = {
  selectedForm: PropTypes.object,
  handleListRefresh: PropTypes.func,
};

export default FormCreate;
