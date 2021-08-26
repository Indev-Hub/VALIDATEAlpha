import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createForm } from '../../../graphql/mutations';
import { getUser } from 'src/graphql/queries';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import { Box, Paper, Button } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
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

  // Create unique form id (also passed through to UploadMultiplePreview)
  const formId = `form-${uuidv4()}`;

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
      tags: JSON.parse(selectedForm.tags),
      isPrivate: selectedForm.isPrivate,
      companyID: selectedForm.companyID,
      // companyName: selectedForm.companyName,
    }
  } else {
    initialDetails = {
      title: '',
      description: '',
      tags: [''],
      isPrivate: false,
      companyID: [''],
    }
  };

  const [detailsState, setDetailsState] = useState(initialDetails);
  console.log('FormCreate-detailsState', detailsState)

  // Initialize questions state
  const blankQuestion = {
    questionId: 1,
    question: '',
    type: '',
    images: false,
    randomize: '',
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


  //==================================//
  //           CREATE FORM            //
  //==================================//

  // Construct data object to be used as output for DB and prop for form preview
  const createFormDesignDataSet = () => {
    // Deconstruct form properties
    const {
      title,
      description,
      tags,
      isPrivate,
      companyID,
    } = detailsState;

    // The input data to be sent in our createForm request 
    const formDesignDataSet = {
      id: formId,
      title: title,
      description: description,
      tags: JSON.stringify(tags),
      isPrivate: isPrivate,
      companyID: companyID,
      companyName: getCompanyName(),
      validations: JSON.stringify(questionsState),
    };

    return formDesignDataSet;
  };


  //==================================//
  //           FORM PREVIEW           //
  //==================================//
  const [formPreview, setFormPreview] = useState(null);
  const previewForm = () => {
    const formDesign = createFormDesignDataSet();
    setFormPreview(formDesign);
  };


  //==================================//
  //           UPLOAD FORM            //
  //==================================//

  const [formImages, setFormImages] = useState([]);
  
  //==================================//
  //            Upload to s3          //
  //==================================//

  

  const uploadForm = async () => {
    // Get user attributes
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    const userName = signInUserSession.accessToken.payload.username;
    const userId = signInUserSession.accessToken.payload.sub

    // Get form design schema and output to DynamoDB
    const formDesignDataSet = createFormDesignDataSet();

    console.log(
      'FormCreate#uploadForm', JSON.stringify(formDesignDataSet, null, 2)
    );

    try {
      await API.graphql(graphqlOperation(
        createForm, { input: formDesignDataSet }
      ));
      setNotify({
        isOpen: true,
        message: `Submitted Successfully`,
        type: 'success'
      });

      // Refresh if submitted from TestList page (i.e., starting from duplicate)
      // or redirect to TestList page if submitted from TestCreate route
      selectedForm ?
        setTimeout(() => handleListRefresh(), 1200)
        : setTimeout(() => navigate("/dashboard/form-collection"), 1200);
    } catch (error) {
      console.log('error uploading form', error);
      setNotify({
        isOpen: true,
        message: `Upload Failed: ${JSON.stringify(error)}`,
        type: 'error'
      });
    }
  };

  
  //==================================//
  //      USER TABLE INFORMATION      //
  //==================================//

  // Set state for User table
  const [userData, setUserData] = useState();

  // Load User table data
  useEffect(() => {
    getUserTable();
  }, [])

  // API call to get User table data
  const getUserTable = async () => {
    try {
      const userData = await API.graphql(graphqlOperation(getUser, { id: user.id }));
      const userList = userData.data.getUser;
      setUserData(userList);
      console.log('user info', userList);
      console.log('user sub', user.id)
    } catch (error) {
      console.log('error on fetching user table', error);
    }
  };

  // Get company name from selected companyId, '' if none
  const getCompanyName = () => {
    const matchName = userData.companies.items.filter(
      item => detailsState.companyID.includes(item.id)
    );
    return matchName[0] ? matchName[0].name : '' ;
  }

  return (
    <React.Fragment>
      <Formik>
        <Form autoComplete="off">
          {/* Company details part of the form */}
          <FormDetails
            userData={userData}
            detailsState={detailsState}
            setDetailsState={setDetailsState}
          />
          {/* Start mapping the validation questions */}
          <FormQuestions
            formId={formId}
            questionsState={questionsState}
            setQuestionsState={setQuestionsState}
            blankQuestion={blankQuestion}
            previewForm={previewForm}
            uploadForm={uploadForm}
            formImages={formImages}
            setFormImages={setFormImages}
          />
          <Button
            sx={{ mt: 3, padding: 2 }}
            fullWidth
            color="primary"
            type="button"
            variant="contained"
            onClick={uploadForm}
            // onClick={onClick}
          >
            CREATE FORM
          </Button>
          <Button onClick={console.log('Image State / Form Create', formImages)}>Check State</Button>
        </Form>
      </Formik >

      {formPreview ? (
        <Paper elevation={3} sx={{ mt: 2 }}>
          <Box p={4}>
            <FormSubmission
              formDesign={formPreview}
              displaySubmitButton={false}
              userData={userData}
            />
          </Box>
        </Paper>
      ) : (
        null 
      )}
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
  formImages: PropTypes.array,
  setFormImages: PropTypes.func
};

export default FormCreate;
