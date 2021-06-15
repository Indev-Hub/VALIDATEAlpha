/* eslint-disable */
import { useState } from 'react';
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

    if (validSubmit === false) {
      
    }
    else if (validSubmit === true) {
      console.log('user name', userName);
      console.log('user id', userId);
  
      //Upload the video
      console.log('unique id', formID)
      console.log('formData', formData);
      const { title, description, showcase, order, ownerName, ownerId } = formData;
      // const { key } = await Storage.put(`${userId}/${title}_${formID}.mp4`, formatData, { contentType: 'video/*' });
  
      const createFormInput = {
        id: `form-${formID}`,
        companyID: '',
        company: '',
        ownerId: userId,
        ownerName: userName
      };
      // await API.graphql(graphqlOperation(createForm, { input: createFormInput }));
      console.log('Form Input', createFormInput)
      setValidSubmit(false);
      // onUpload();
    }
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
                  {/* <Typography
                    color="textSecondary"
                    sx={{
                      mb: 2,
                      mt: 3
                    }}
                    variant="subtitle2"
                  >
                    Description
                  </Typography>
                  <QuillEditor
                    onChange={(value) => setFieldValue('description', value)}
                    placeholder="Write something"
                    sx={{ height: 400 }}
                    value={values.description}
                  />
                  {(touched.description && errors.description) && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {errors.description}
                      </FormHelperText>
                    </Box>
                  )} */}
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
              {/* <Card>
                <CardHeader title="Organize" />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Category"
                    name="category"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={values.category}
                    variant="outlined"
                  >
                    {categoryOptions.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                  </TextField>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(touched.productCode && errors.productCode)}
                      fullWidth
                      helperText={touched.productCode && errors.productCode}
                      label="Product Code"
                      name="productCode"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.productCode}
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      error={Boolean(touched.productSku && errors.productSku)}
                      fullWidth
                      helperText={touched.productSku && errors.productSku}
                      label="Product Sku"
                      name="productSku"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.productSku}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card> */}
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
                  onClick={submitForm()}
                >
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
