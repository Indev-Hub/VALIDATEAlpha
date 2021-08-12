import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import countries from './countries';
import states from './states';
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

const ProfileLocation = (props) => {
  // Destructure props
  const { profileData, handleProfileChange } = props;
  const { onBack, onNext, ...other } = props;
  const [countryUpdate, setCountryUpdate] = useState('states_us');
  const [tag, setTag] = useState('');
  console.log('profile DATA:', profileData);

  useEffect(() => {
    countrySwitch(profileData.country);
    setCountryUpdate(countrySwitch(profileData.country));
    console.log('country update:', countryUpdate);
  }, [profileData.country])

  function countrySwitch (param) {
    switch(param) {
      // case 'United States':
      //   return (
      //     states.states_us.map((state, idx) => (
      //       <MenuItem value={state.value}>{`${state.text} (${state.value})`}</MenuItem>
      //     ))
      //   );
      case 'Canada':
        return (
          states.provinces_ca.map((state, idx) => (
            <MenuItem value={state.value}>{`${state.text} (${state.value})`}</MenuItem>
          ))
        );      
      case 'Mexico':
        return (
          states.states_mx.map((state, idx) => (
            <MenuItem value={state.value}>{`${state.text} (${state.value})`}</MenuItem>
          ))
        );  
      default:
        return (
          states.states_us.map((state, idx) => (
            <MenuItem value={state.value}>{`${state.text} (${state.value})`}</MenuItem>
          ))
        );
    }
  }
  
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
              Location Details
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Information about your geolocation and physical space.
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid
                item
                xs={6}
              >
                <TextField
                  select
                  label="Country"
                  name="country"
                  value={profileData.country}
                  onChange={handleProfileChange}
                  variant="outlined"
                  fullWidth
                >
                  {countries.map((country, idx) => (
                    <MenuItem value={country.text}>{country.text}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                md={6}
                xs={6}
              >
                <TextField
                  select
                  label="State/Province"
                  name="state"
                  value={profileData.state}
                  onChange={handleProfileChange}
                  variant="outlined"
                  fullWidth
                >
                  {countrySwitch(profileData.country)}
                </TextField>
              </Grid>
              <Grid
                item
                md={6}
                xs={6}
              >
                <TextField
                  error={Boolean(touched.city && errors.city)}
                  fullWidth
                  helperText={touched.city && errors.city}
                  label="City"
                  name="city"
                  onBlur={handleBlur}
                  onChange={handleProfileChange}
                  value={profileData.city}
                  variant="outlined"
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

export default ProfileLocation;
