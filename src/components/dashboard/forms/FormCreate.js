import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { Storage } from 'aws-amplify';
import { Formik, Form } from 'formik';
import { Box, Button, Paper } from '@material-ui/core';
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
    message: "",
    type: "",
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
    question: "",
    type: "",
    images: false,
    randomize: "",
    options: [""],
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
      formId,
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
  //           PREVIEW FORM           //
  //==================================//
  const [formPreview, setFormPreview] = useState(null);
  const previewForm = () => {
    const formDesign = createFormDesignDataSet();
    setFormPreview(formDesign);
  };

  //==================================//
  //           UPLOAD FORM            //
  //==================================//
  
  // State passed through FormQuestions to UploadMultiplePreview
  const [formImages, setFormImages] = useState([]);

  // Upload images to S3
  const handleImgUpload = async (path, file) => {
    try {
      await Storage.put(path, file, {contentType: 'image'});
    } catch (error) {
      console.log('error on uploading images to s3', error);
    }
  };

  // Map through image/url pairs and pass to S3 upload function
  const s3Upload = () => {
    formImages.map(pair => {
      handleImgUpload(pair[0], pair[1]);
    })
  };

  const uploadForm = async () => {
    // Get user attributes
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    const userName = signInUserSession.accessToken.payload.username;
    const userId = signInUserSession.accessToken.payload.sub;

    // Get form design schema and output to DynamoDB
    const formDesignDataSet = createFormDesignDataSet();

    // Uncomment to console log complete form design structure
    // console.log(
    //   "FormCreate uploadForm formDesignDataSet:",
    //   JSON.stringify(formDesignDataSet, null, 2)
    // );

    try {
      await API.graphql(
        graphqlOperation(createForm, { input: formDesignDataSet })
      );
      setNotify({
        isOpen: true,
        message: `Submitted Successfully`,
        type: "success",
      });

      s3Upload();

      // Refresh if submitted from TestList page (i.e., starting from duplicate)
      // or redirect to TestList page if submitted from TestCreate route
      selectedForm ?
        setTimeout(() => handleListRefresh(), 1200)
        : setTimeout(() => navigate("/dashboard/company/forms"), 1200);

    } catch (error) {
      console.log("error uploading form", error);
      setNotify({
        isOpen: true,
        message: `Upload Failed: ${JSON.stringify(error)}`,
        type: "error",
      });
    }
  };

  //checks each form value before uploading form to database
  const validateFormFields = () => {
    if (detailsState.title === "") {
      return setNotify({
        isOpen: true,
        message: "Form Name Must Be Filled Out Before Submission",
        type: "error",
      });
    } else if (detailsState.companyID === undefined) {
      return setNotify({
        isOpen: true,
        message: "Company Name Must Be Selected Before Submission",
        type: "error",
      });
    } else {
      for (let i = 0; i < questionsState.length; i++) {
        if (questionsState[i].question === ""
          || questionsState[i].type === ""
          || questionsState[i].options.includes("")) {
          return setNotify({
            isOpen: true,
            message: "Your Questions Must Be Filled Out Completely",
            type: "error",
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
      console.log("FormCreate getUserTable userList:", userList);
      console.log("FormCreate getUserTable user.id:", user.id);
    } catch (error) {
      console.log("error on fetching user table", error);
    }
  };

  // Get company name from selected companyId, '' if none
  const getCompanyName = () => {
    const matchName = userData.companies.items.filter(
      item => detailsState.companyID.includes(item.id)
    );
    return matchName[0] ? matchName[0].name : '';
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
            formId={detailsState.formId}
            questionsState={questionsState}
            setQuestionsState={setQuestionsState}
            blankQuestion={blankQuestion}
            previewForm={previewForm}
            validateFormFields={validateFormFields}
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
            onClick={validateFormFields}
          >
            CREATE FORM
          </Button>
        </Form>
      </Formik>
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
      ) : null}

      <Notification notify={notify} setNotify={setNotify} />
    </React.Fragment>
  );
};

FormCreate.propTypes = {
  selectedForm: PropTypes.object,
  handleListRefresh: PropTypes.func,

};

export default FormCreate;
