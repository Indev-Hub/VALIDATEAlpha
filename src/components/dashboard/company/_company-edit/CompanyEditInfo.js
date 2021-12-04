import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  // Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { API, graphqlOperation } from 'aws-amplify';
import {
  updateCompany,
} from '../../../../graphql/mutations';
import wait from '../../../../utils/wait';

const CompanyEditInfo = (props) => {
  const { company, companyInfo, handleFieldChange, companyUpdate } = props;
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <Grid container justifyContent="center">
        <Grid
          item
          xs={12}
        >
          <Formik
            enableReinitialize
            initialValues={{
              name: companyInfo.name || '',
              description: companyInfo.description || '',
              submit: null
            }}
            validationSchema={Yup
              .object()
              .shape({
                name: Yup.string().max(50).required('Your company must have a name!'),
                description: Yup.string().max(500).required('Your company must have a description!'),
                category: Yup.string(),
                startDate: Yup.string().required('Please enter the date you started this company'),
                endDate: Yup.string().required('Please enter an estimated date you will finish this company'),
                devStage: Yup.string().required('Pick the closest stage that your company is in'),
              })}
            onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
              try {
                console.log('company id', company.id)
                // NOTE: Make API request
                const updateCompanyInput = {
                  id: companyInfo.id,
                  name: companyInfo.name,
                  description: companyInfo.description,
                };
                console.log('company info before', updateCompanyInput);
                // Error occurring here:
                const upProj = await API.graphql(graphqlOperation(updateCompany, { input: updateCompanyInput }));
                console.log('company info after', upProj.data);

                await wait(200);
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                enqueueSnackbar('Company updated', {
                  anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top'
                  },
                  variant: 'success'
                });
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form onSubmit={handleSubmit}>
                {/* <Card> */}
                  {/* <CardHeader title={company.name} />
                  <Divider /> */}
                  {/* <CardContent> */}
                    <Grid
                      container
                      spacing={4}
                      px={1}
                    >
                      <Grid
                        item
                        md={8}
                        xs={12}
                      >
                        <Box>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name}
                            label="Company Name"
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleFieldChange}
                            value={companyInfo.name}
                            variant="outlined"
                          />
                        </Box>
                        <Box mt={3}>
                          <TextField
                            error={Boolean(touched.description && errors.description)}
                            fullWidth
                            helperText={touched.description && errors.description}
                            label="Description"
                            name="description"
                            onBlur={handleBlur}
                            onChange={handleFieldChange}
                            value={companyInfo.description}
                            variant="outlined"
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={3}
                        xs={12}
                      >
                        <Box>
                          <TextField
                            error={Boolean(touched.startDate && errors.startDate)}
                            fullWidth
                            helperText={touched.startDate && errors.startDate}
                            label="Start Date"
                            name="startDate"
                            type="date"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={companyInfo.startDate}
                            variant="outlined"
                          />
                        </Box>
                        <Box mt={3}>
                          <TextField
                            error={Boolean(touched.endDate && errors.endDate)}
                            fullWidth
                            helperText={touched.endDate && errors.endDate}
                            label="End Date"
                            name="endDate"
                            type="date"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={companyInfo.endDate}
                            variant="outlined"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    {errors.submit && (
                      <Box sx={{ mt: 3 }}>
                        <FormHelperText error>
                          {errors.submit}
                        </FormHelperText>
                      </Box>
                    )}
                  {/* </CardContent> */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: 2
                    }}
                  >
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                      onClick={companyUpdate}
                    >
                      Update Company
                    </Button>
                  </Box>
                {/* </Card> */}
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </>
  )
}

export default CompanyEditInfo
