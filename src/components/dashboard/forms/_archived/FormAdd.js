/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { createForm } from '../../../graphql/mutations';
import * as Yup from 'yup';
// import { v4 as uuid } from 'uuid';
import Amplify, { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import {
  Button,
	// Card,
	// CardHeader,
	// CardContent,
	IconButton,
	TextField,
	Box,
  Select
} from '@material-ui/core';
import { uniqueId } from 'lodash';
import { Publish } from '@material-ui/icons';
import { Formik, FieldArray } from 'formik';
import { Plus } from 'src/icons';
// import FileDropzone from './FileDropzone';

const FormAdd = () => {
  const [formData, setFormData] = useState({});
  const [formArray, setFormArray] = useState({});
  const [formatData, setformatData] = useState();

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState('');
	const [userName, setUserName] = useState('');

  
	useEffect(() => {
	  try {
		setError(null);
		setLoading(true);
  
		Auth.currentAuthenticatedUser({
		  bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
		}).then(user => {
		  setUserId(user.signInUserSession.accessToken.payload.sub);
		  setUserName(user.signInUserSession.accessToken.payload.username);

		}).catch(err => setError(err));
	  }
	  catch (e) {
		setError(e);
	  }
	  finally {
		setLoading(false);
	  }
	}, []);


    const uploadForm = async () => {
			//Get user attributes
			const { signInUserSession } = await Auth.currentAuthenticatedUser();
			const userName = signInUserSession.accessToken.payload.username;
			const userId = signInUserSession.accessToken.payload.sub

			console.log('user name', userName);
			console.log('user id', userId);

			//Upload the form
			const formID = uniqueId();
			console.log('unique id', formID)
			console.log('formData', formData);
      const { name, companyName } = formData;
			// const { key } = await Storage.put(`${userId}/${title}_${formId}.mp4`, formatData, { contentType: 'form/*' });

      const formArray = [
        {
          "type": "int",
          "question": "How old are you?",
          "options": "/[int]/",
        },
        {
          "type": "text",
          "question": "Where were you born?",
          "options": "/String/",
        },
        {
          "type": "img",
          "question": "Which image is your favorite?",
          "options": "[img]",
        }
      ]

			const createFormInput = {
        id: `form-${formID}`,
        companyID: 'company-2',
        name: name,
        companyName: companyName,
        validations: JSON.stringify(formArray)
			};
			await API.graphql(graphqlOperation(createForm, { input: createFormInput }));
			// onUpload();
		};

		return (
      <Formik
        initialValues={{
          formName: '',
          company: '',
          images: [],
          logos: [],
          submit: null
        }}
        validationSchema={Yup
          .object()
          .shape({
            category: Yup.string().max(255),
            description: Yup.string().max(5000),
            images: Yup.array(),
            includesTaxes: Yup.bool().required(),
            isTaxable: Yup.bool().required(),
            formName: Yup.string().max(255).required(),
            price: Yup.number().min(0).required(),
            productCode: Yup.string().max(255),
            productSku: Yup.string().max(255),
            salePrice: Yup.number().min(0),
            logos: Yup.string().min(0),
            caption: Yup.string().min(0)
          })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // NOTE: Make API request
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Product Created', {
              anchorOrigin: {
                horizontal: 'right',
                vertical: 'top'
              },
              variant: 'success'
            });
            navigate('/dashboard/products');
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          touched,
          values
        }) => (
          <form
            onSubmit={handleSubmit}
          >
            <Box>
              <TextField
                label="Form Name"
                name="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                label="Company"
                name="companyName"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
              />
                    <FieldArray name="elements">
                      {({ insert, remove, push }) => (
                        <Box>
                          {/* {formArray.length > 0 && */}
                            {formArray.map((element, index) => (
                              <Grid key={index} display="flex">
                                <Box width="100%">
                                  <Grid sx={{ m:1 }}>
                                    <TextField
                                      label="Question"
                                      name="question"
                                      value={formArray.question}
                                      onChange={e => setFormArray({ ...formArray, question: e.target.value })}
                                    />
                                  </Grid>
                                  <Grid sx={{ m:1 }}>
                                    <FormControl variant="outlined">
                                      <InputLabel>Question Type</InputLabel>
                                      <Select
                                        name="type"
                                        value={formArray.type}
                                        onChange={e => setFormArray({ ...formArray, type: e.target.value })}
                                        label="Age"
                                      >
                                        <MenuItem value="">
                                          <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                </Box>
                                <Grid item xs={2}>
                                  <Button
                                    type="button"
                                    // onClick={() => remove(index)}
                                  >
                                    X
                                  </Button>
                                </Grid>
                              </Grid>
                            ))}
                          <Button
                            // onClick={() => push({ name: '', email: '' })}
                            variant="contained"
                            color="secondary"
                            sx={{ m:1, pr:3 }}
                            startIcon={<Plus />}
                          >
                            Add Validation
                          </Button>
                        </Box>
                      )}
                    </FieldArray>          
                    <IconButton>
                      <Publish />
                  </IconButton>
                </Box>
          </form>
        )}
      </Formik>
    );
};

export default FormAdd;
