/* eslint-disable */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ErrorMessage, FieldArray, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import FileDropzone from '../../FileDropzone';
import QuillEditor from '../../QuillEditor';
import { Plus } from 'src/icons';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { uniqueId } from 'lodash';
import { createForm } from 'src/graphql/mutations';

const CreateCustomForm = (props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({});
  const [validSubmit, setValidSubmit] = useState(false);

  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const submitForm = async () => {
    //Get user attributes
    const { signInUserSession } = await Auth.currentAuthenticatedUser();
    const userName = signInUserSession.accessToken.payload.username;
    const userId = signInUserSession.accessToken.payload.sub
    const formID = uniqueId();
    
    useEffect(() => {

      //Upload the form
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
      console.log('submit:', validSubmit)
			const createFormInput = {
        id: `form-${formID}`,
        companyID: 'company-2',
        name: name,
        companyName: companyName,
        validations: JSON.stringify(formArray)
			};
			API.graphql(graphqlOperation(createForm, { input: createFormInput }));
      console.log('valid submit:', validSubmit)
      // onUpload();
    }, [validSubmit])
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
          {...props}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={8}
              md={6}
              xs={12}
            >
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.formName && errors.formName)}
                    fullWidth
                    helperText={touched.formName && errors.formName}
                    label="Form Name"
                    name="formName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.formName}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.formName && errors.formName)}
                    fullWidth
                    helperText={touched.formName && errors.formName}
                    label="Company Name"
                    name="company"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.company}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
              <Box sx={{ mt: 3 }}>
                <Card>
                  <CardHeader title="Upload Logos" />
                  <CardContent>
                  <FieldArray name="images">
                    {({ insert, remove, push }) => (
                      <Box>
                        {values.images.length > 0 &&
                          values.images.map((image, index) => (
                            <Grid key={index} display="flex">
                              <Box width="100%">
                                <Grid sx={{ m:1 }}>
                                  <TextField
                                    error={Boolean(touched.caption && errors.caption)}
                                    fullWidth
                                    helperText={touched.caption && errors.caption}
                                    label={`Image ${index}`}
                                    name={`friends.${index}.name`}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.caption}
                                    variant="outlined"
                                    placeholder={`Image #${index}`}
                                    type="text"
                                  />
                                  <ErrorMessage
                                    name={`friends.${index}.name`}
                                    component="div"
                                    className="field-error"
                                  />
                                </Grid>
                                <Grid sx={{ m:1 }}>
                                  <FileDropzone
                                    accept="image/*"
                                    files={files}
                                    onDrop={handleDrop}
                                    onRemove={handleRemove}
                                    onRemoveAll={handleRemoveAll}
                                  />
                                </Grid>
                              </Box>
                              <Grid item xs={2}>
                                <Button
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  X
                                </Button>
                              </Grid>
                            </Grid>
                          ))}
                        <Button
                          onClick={() => push({ name: '', email: '' })}
                          variant="contained"
                          color="secondary"
                          sx={{ m:1, pr:3 }}
                          startIcon={<Plus />}
                        >
                          Add Logo
                        </Button>
                      </Box>
                    )}
                  </FieldArray>
                  </CardContent>
                </Card>
              </Box>
              <Button 
                sx={{ mt: 3, padding: 2 }}
                fullWidth
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                CREATE FORM
              </Button>
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xs={12}
            >
            
              {errors.submit && (
                <Box sx={{ mt: 3 }}>
                  <FormHelperText error>
                    {errors.submit}
                  </FormHelperText>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mt: 3
                }}
              >
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                  onClick={setValidSubmit(true)}
                >
                  {console.log('submit:', validSubmit)}
                  Create Form
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default CreateCustomForm;
