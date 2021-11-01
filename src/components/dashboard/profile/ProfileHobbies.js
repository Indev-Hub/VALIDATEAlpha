import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@material-ui/lab/MobileDatePicker';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import countries from './countries';
import states from './states';

const selectOptions = {

    frequency: [
      {label: 'Daily', value: 'male'},
      {label: 'Weekly', value: 'female'},
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
    ],

    ethnicity: [
      {label: 'American Indian', value: 'americanIndian'},
      {label: 'Alaska Native', value: 'alaskaNative'},
      {label: 'Asian', value: 'asian'},
      {label: 'Black', value: 'black'},
      {label: 'Hispanic/Latino', value: 'latino'},
      {label: 'Pacific Islander', value: 'pacificIslander'},
      {label: 'White', value: 'white'}
    ],

    maritalStatus: [
      {label: 'Single', value: 'single'},
      {label: 'Engaged', value: 'engaged'},
      {label: 'Married', value: 'married'},
      {label: 'Divorced', value: 'divorced'},
      {label: 'Widow(ed/er)', value: 'widow'}
    ],

    pets: [
      {label: 'Dog', value: 'dog'},
      {label: 'Cat', value: 'cat'},
      {label: 'Bird', value: 'bird'},
      {label: 'Reptile', value: 'reptile'},
      {label: 'Insect', value: 'insect'}
    ]

};

const gridConstruct = {
  xs: 12,
  sm: 6,
  md: 4,
  lg: 3,
  pt: 2
}

const ProfileHobbies = (props) => {
  // Destructure props
  const { profileData, handleProfileChange, setProfileData } = props;
  const { onBack, onNext, ...other } = props;
  // console.log('profile DATA:', profileData);

  // START PETS ARRAY
  const [petArray, setPetArray] = useState([]);

  const handleArrayChange = (event) => {
    const {
      target: { value },
    } = event;
    setPetArray(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  // END PETS ARRAY

  return (
    <Formik
      initialValues={{
        drinks: '',
        eatOut: '',
        nightclub: '',
        soccer: '',
        football: '',
        baeball: '',
        tennis: '',
        swimming: '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          drinks: Yup.number(),
          eatOut: Yup.string(),
          nightclub: Yup.string(),
          soccer: Yup.string(),
          football: Yup.string(),
          baeball: Yup.string(),
          tennis: Yup.string(),
          swimming: Yup.string()
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
              Personal Interests and Hobbies
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Information about all the things that make you enjoy life.
            </Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12}>
                <Typography sx={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                  Out Of Home
                </Typography>
              </Grid>
              <Grid item
                pt={gridConstruct.pt}
                xs={gridConstruct.xs}
                sm={gridConstruct.sm}
                md={gridConstruct.md}
                lg={gridConstruct.lg}
              >
                <TextField
                  fullWidth
                  label="Alcohol Consumption"
                  placeholder="Drinks per week"
                  name="drinks"
                  color="success"
                  type="number"
                  variant="outlined"
                  value={profileData.drinks}
                  onChange={handleProfileChange}
                  InputLabelProps={{
                    shrink: true,
                  }}   
                />
              </Grid>
              <Grid item
                pt={gridConstruct.pt}
                xs={gridConstruct.xs}
                sm={gridConstruct.sm}
                md={gridConstruct.md}
                lg={gridConstruct.lg}
              >
                <TextField
                  fullWidth
                  label="Eating Out"
                  placeholder="Eating out per week"
                  name="eatOut"
                  color="success"
                  type="number"
                  variant="outlined"
                  value={profileData.eatOut}
                  onChange={handleProfileChange}
                  InputLabelProps={{
                    shrink: true,
                  }}   
                />
              </Grid>
              <Grid item
                pt={gridConstruct.pt}
                xs={gridConstruct.xs}
                sm={gridConstruct.sm}
                md={gridConstruct.md}
                lg={gridConstruct.lg}
              >
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
              <Grid item
                pt={gridConstruct.pt}
                xs={gridConstruct.xs}
                sm={gridConstruct.sm}
                md={gridConstruct.md}
                lg={gridConstruct.lg}
              >
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
              <Grid item
                  pt={gridConstruct.pt}
                  xs={gridConstruct.xs}
                  sm={gridConstruct.sm}
                  md={gridConstruct.md}
                  lg={gridConstruct.lg}
                >
                  <TextField
                    fullWidth
                    label="Ethnicity"
                    name="ethnicity"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    onChange={handleProfileChange}
                  >
                    {selectOptions.ethnicity.map((ethnicity) => (
                      <option
                        key={ethnicity.value}
                        value={ethnicity.value}
                      >
                        {ethnicity.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
            </Grid>
          </Card>
        </form>
      )}
    </Formik>
  );

};

export default ProfileHobbies;
