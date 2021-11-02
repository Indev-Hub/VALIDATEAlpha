import React, { useEffect, useState } from 'react';
import {
  Alert, AlertTitle, Box, Button, Dialog, IconButton, Tooltip, Typography
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createForm } from '../../../graphql/mutations';
import { getUser } from '../../../graphql/queries';
import useAuth from '../../../hooks/useAuth';
import FormDetails from './FormDetails';
import FormQuestions from './FormQuestions';
import FormSubmission from '../../form/FormSubmission';
import Notification from '../../form/Notification';

const FormCreate = props => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // This is used if duplicating from existing form in TestList
  const { selectedForm = null, handleListRefresh } = props;

  // Set state of upload success and failure notifications
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });

  // Initialize form details state
  let initialDetails;
  if (selectedForm) {
    // If duplicating from existing form
    initialDetails = {
      formId: `form-${uuidv4()}`,
      title: selectedForm.title,
      description: selectedForm.description,
      tags: JSON.parse(selectedForm.tags),
      isPrivate: selectedForm.isPrivate,
      companyID: selectedForm.companyID
    };
  } else {
    initialDetails = {
      formId: `form-${uuidv4()}`,
      title: '',
      description: '',
      tags: [],
      isPrivate: false,
    };
  }

  const [detailsState, setDetailsState] = useState(initialDetails);

  // Initialize questions state
  const blankQuestion = {
    questionId: 1,
    question: '',
    type: '',
    images: false,
    randomize: true,
    options: [''] //this will need to be changed when pcking the type of image
  };

  let initialQuestions;
  if (selectedForm) {
    // If duplicating from existing form
    initialQuestions = JSON.parse(selectedForm.validations);
    // Remove any images from image answer types
    initialQuestions.forEach(question => {
      if (question.type === 'Images') {
        question.options = [''];
      };
    });
  } else {
    initialQuestions = [blankQuestion];
  };

  const [questionsState, setQuestionsState] = useState(initialQuestions);

  //==================================//
  //           CREATE FORM            //
  //==================================//

  // Construct data object to be used as output for DB and prop for form preview
  const createFormDesignDataSet = () => {
    // Deconstruct form properties
    const {
      formId,
      title,
      description,
      tags,
      isPrivate,
      companyID
    } = detailsState;

    // The input data to be sent in our createForm request
    const formDesignDataSet = {
      id: formId,
      title: title,
      description: description,
      tags: JSON.stringify(tags),
      isPrivate: isPrivate,
      companyID: userData.companies.items.length > 1 ? companyID : userData.companies.items[0].id,
      companyName: userData.companies.items.length > 1 ? getCompanyName() : userData.companies.items[0].name,
      validations: JSON.stringify(questionsState),
    };

    return formDesignDataSet;
  };

  //==================================//
  //           PREVIEW FORM           //
  //==================================//
  const [formPreview, setFormPreview] = useState(null);

  const previewForm = () => {
    const formDesign = createFormDesignDataSet();
    setFormPreview(formDesign);
  };

  const handlePreviewClose = () => {
    setFormPreview(null);
  };

  //==================================//
  //           UPLOAD FORM            //
  //==================================//

  // State passed to FormQuestions, primarily managed by imageStateUpdate
  const [formImages, setFormImages] = useState({});

  // Upload images to S3
  const handleImgUpload = async (path, file) => {
    try {
      await Storage.put(path, file, { contentType: 'image' });
    } catch (error) {
      console.log('error on uploading images to s3', error);
    }
  };

  // Map through image/url pairs and pass to S3 upload function
  const s3Upload = () => {
    Object.values(formImages).forEach(imageArray => {
      imageArray.forEach(imagePair => {
        handleImgUpload(imagePair[0], imagePair[1])
      })
    });
  };

  const uploadForm = async () => {
    // Get form design schema and output to DynamoDB
    const formDesignDataSet = createFormDesignDataSet();

    // Uncomment to console log complete form design structure
    // console.log(
    //   'FormCreate uploadForm formDesignDataSet:',
    //   JSON.stringify(formDesignDataSet, null, 2)
    // );

    try {
      await API.graphql(
        graphqlOperation(createForm, { input: formDesignDataSet })
      );
      setNotify({
        isOpen: true,
        message: `Submitted Successfully`,
        type: 'success',
      });

      s3Upload();

      // Refresh if submitted from FormList page (i.e., starting from duplicate)
      // or redirect to FormList page if submitted from form-create route
      selectedForm ?
        setTimeout(() => handleListRefresh(), 1200)
        : setTimeout(() => navigate('/dashboard/company/forms'), 1200);

    } catch (error) {
      console.log('error uploading form', error);
      setNotify({
        isOpen: true,
        message: `Upload Failed: ${JSON.stringify(error)}`,
        type: 'error',
      });
    }
  };

  // Validate required form fields before uploading form to database
  const validateFormFields = () => {
    if (detailsState.title === '') {
      return setNotify({
        isOpen: true,
        message: 'Form Name Must Be Filled Out Before Submission',
        type: 'error',
      });
    } else if (detailsState.companyID === undefined) {
      return setNotify({
        isOpen: true,
        message: 'Company Name Must Be Selected Before Submission',
        type: 'error',
      });
    } else {
      for (let i = 0; i < questionsState.length; i++) {
        if (questionsState[i].question === ''
          || questionsState[i].type === '') {
          return setNotify({
            isOpen: true,
            message: 'Your Questions Must Have a Question and an Answer Type',
            type: 'error',
          });
        }
      }
    }
    return uploadForm();
  }

  //==================================//
  //      USER TABLE INFORMATION      //
  //==================================//

  // Set state for User table
  const [userData, setUserData] = useState();

  // Load User table data
  useEffect(() => {
    getUserTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API call to get User table data
  const getUserTable = async () => {
    try {
      const userData = await API.graphql(
        graphqlOperation(getUser, { id: user.id })
      );
      const userList = userData.data.getUser;
      setUserData(userList);
    } catch (error) {
      console.log('error on fetching user table', error);
    }
  };

  // Get company name from selected companyId, '' if none
  const getCompanyName = () => {
    if (detailsState.companyID) {
      const matchName = userData.companies.items
        .filter(item => detailsState.companyID.includes(item.id));
      return matchName[0] ? matchName[0].name : '';
    } else {
      console.log('FormCreate detailsState.companyID is undefined');
    }
  }

  return (
    <>
      <Formik>
        <Form autoComplete='off'>
          {/* Company details part of the form */}
          <FormDetails
            userData={userData}
            detailsState={detailsState}
            setDetailsState={setDetailsState}
          />
          {/* Start mapping the validation questions */}
          <FormQuestions
            formId={detailsState.formId}
            questionsState={questionsState}
            setQuestionsState={setQuestionsState}
            blankQuestion={blankQuestion}
            previewForm={previewForm}
            uploadForm={uploadForm}
            formImages={formImages}
            setFormImages={setFormImages}
            selectedForm={selectedForm}
          />
          <Button
            sx={{ mt: 3, padding: 2 }}
            fullWidth
            color='primary'
            type='button'
            variant='contained'
            onClick={validateFormFields}
          >
            CREATE FORM
          </Button>
        </Form>
      </Formik>
      {formPreview && (
        detailsState.companyID ? (
          <Dialog 
            open={formPreview}
            fullWidth='true'
            maxWidth='lg'
            onClose={handlePreviewClose}
          >
            <Box textAlign='right' p={2}>
              <Tooltip title='Close Preview'>
                <IconButton
                  type='button'
                  onClick={handlePreviewClose}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>
            <FormSubmission
              formDesign={formPreview}
              previewImages={formImages}
              displaySubmitButton={false}
            />
          </Dialog>
        ) : (
          <Alert severity='error' sx={{ mt: 3, px: 10 }}>
            <AlertTitle variant='h5'>Error creating form preview</AlertTitle>
            <Typography fontWeight='500'>No Company Selected</Typography>
            <Typography>Select a company in the Form Details section. If you have more than one company, we leave the company field blank so that you don't accidentally create a form for the wrong company.</Typography>
          </Alert>
        )
      )}
      <Notification notify={notify} setNotify={setNotify} />
    </>
  );
};

FormCreate.propTypes = {
  selectedForm: PropTypes.object,
  handleListRefresh: PropTypes.func,
};

export default FormCreate;
