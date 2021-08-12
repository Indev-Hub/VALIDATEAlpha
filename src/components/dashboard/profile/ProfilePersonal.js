import { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import {
  Box,
  Button,
  Card,
  Chip,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core';
import PlusIcon from '../../../icons/Plus';

const selectOptions = {

    sex: [
      {label: 'Male', value: 'male'},
      {label: 'Female', value: 'female'},
      {label: 'Non-Binary', value: 'nonBinary'},
      {label: 'No Answer', value: 'noAnswer'}
    ],


    gender: [
      {label: 'Male', value: 'male'},
      {label: 'Female', value: 'female'},
      {label: 'Intersex', value: 'intersex'},
      {label: 'Trans', value: 'trans'},
      {label: 'Non-Conforming', value: 'nonConforming'},
      {label: 'Personal', value: 'personal'},
      {label: 'Eunuch', value: 'eunuch'},
      {label: 'No Answer', value: 'noAnswer'}
    ]

};

const ProfilePersonal = (props) => {
  // Destructure props
  const { profileData, handleProfileChange } = props;
  const { onBack, onNext, ...other } = props;
  const [tag, setTag] = useState('');
  console.log('profile DATA:', profileData);
  
  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        birthday: '',
        sex: '',
        gender: '',
        household: '',
        maritalStatus: '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          birthday: Yup
            .string(),
          firstName: Yup
            .string()
            .min(3, 'Must be at least 3 characters')
            .max(255),
            // .required('Required'),
          lastName: Yup
            .string()
            .min(3, 'Must be at least 3 characters')
            .max(255),
            // .required('Required'),
          tags: Yup.array(),
          startDate: Yup.date(),
          endDate: Yup.date(),
          other: Yup.string()
        })}
      onSubmit={async (profileData, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
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
        setFieldTouched,
        touched,
        // profileData,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          {...other}
        >
          <Card sx={{ p: 3 }}>
            <Typography
              color="textPrimary"
              variant="h6"
            >
              Personal Details
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Information about you as an individual consumer and human being.
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <TextField
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label="First Name"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleProfileChange}
                  value={profileData.firstName}
                  variant="outlined"
                />                
              </Grid>
              <Grid item xs={6}>
                <TextField
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.lastName && errors.lastName}
                  label="Last Name"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleProfileChange}
                  value={profileData.lastName}
                  variant="outlined"
                />                
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Sex"
                  name="sex"
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleProfileChange}
                >
                  {selectOptions.sex.map((sex) => (
                    <option
                      key={sex.value}
                      value={sex.value}
                    >
                      {sex.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Gender"
                  name="gender"
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleProfileChange}
                >
                  {selectOptions.gender.map((gender) => (
                    <option
                      key={gender.value}
                      value={gender.value}
                    >
                      {gender.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Birthday"
                  name="birthday"
                  onChange={handleProfileChange}
                  value={profileData.birthday}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}          
                />

              </Grid>
            </Grid>
            {/* <Box
              sx={{
                display: 'flex',
                mt: 6
              }}
            >
              {onBack && (
                <Button
                  color="primary"
                  onClick={onBack}
                  size="large"
                  variant="text"
                >
                  Previous
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                Next
              </Button>
            </Box> */}
          </Card>
        </form>
      )}
    </Formik>
  );

};

export default ProfilePersonal;
