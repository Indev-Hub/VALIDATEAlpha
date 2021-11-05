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

const ProfilePersonal = (props) => {
  // Destructure props
  const { profileData, handleProfileChange, setProfileData } = props;
  const { onBack, onNext, ...other } = props;
  const [countryUpdate, setCountryUpdate] = useState('states_us');
  const [tag, setTag] = useState('');
  // console.log('profile DATA:', profileData);

  // START CITY/COUNTRY ARRAY
  useEffect(() => {
    countrySwitch(profileData.country);
    setCountryUpdate(countrySwitch(profileData.country));
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
  // END CITY/COUNTRY ARRAY

  // START PETS ARRAY
  const [petArray, setPetArray] = useState([]);

  useEffect(() => {
    setProfileData({
      ...profileData,
      pets: petArray
    });
  }, [petArray])

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
        birthday: profileData.birthday || '',
        sex: profileData.sex || '',
        gender: profileData.gender || '',
        ethnicity: profileData.ethnicity || '',
        household: profileData.household || '',
        maritalStatus: profileData.maritalStatus || '',
        children: profileData.children || '',
        pets: profileData.pets || [],
        city: profileData.city || '',
        state: profileData.state || '',
        country: profileData.country || '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          birthday: Yup.string(),
          sex: Yup.string(),
          gender: Yup.string(),
          ethnicity: Yup.string(),
          household: Yup.string(),
          maritalStatus: Yup.string(),
          children: Yup.number(),
          pets: Yup.array(),
          city: Yup.string(),
          state: Yup.string(),
          country: Yup.string()
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
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12}>
                <Typography sx={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                  Identity
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
                  label="Sex"
                  name="sex"
                  select
                  SelectProps={{ native: true }}
                  value={profileData.sex}
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
                  value={profileData.gender}
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
                    value={profileData.ethnicity}
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
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12}>
                <Typography sx={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                  Family Life
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
                    label="Marital Status"
                    name="maritalStatus"
                    color="success"
                    select
                    SelectProps={{ native: true }}
                    value={profileData.maritalStatus}
                    variant="outlined"
                    onChange={handleProfileChange}
                  >
                    {selectOptions.maritalStatus.map((maritalStatus) => (
                      <option
                        key={maritalStatus.value}
                        value={maritalStatus.value}
                      >
                        {maritalStatus.label}
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
                    label="Household Members"
                    placeholder="Number of people"
                    name="household"
                    color="success"
                    type="number"
                    variant="outlined"
                    value={profileData.household}
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
                    label="Children"
                    placeholder="Number of kids"
                    name="children"
                    color="success"
                    type="number"
                    variant="outlined"
                    value={profileData.children}
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
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="pets-id" sx={{ mt:-1, ml:1.75 }}>Pets</InputLabel>
                    <Select
                      labelId="pets-id"
                      multiple
                      value={profileData.pets}
                      onChange={handleArrayChange}
                      input={<OutlinedInput label="Pets" />}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {selectOptions.pets.map((name) => (
                        <MenuItem key={name.value} value={name.value}>
                          <Checkbox checked={petArray.indexOf(name.value) > -1} />
                          <ListItemText primary={name.value} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12}>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                    Location
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
                <Grid item
                  pt={gridConstruct.pt}
                  xs={gridConstruct.xs}
                  sm={gridConstruct.sm}
                  md={gridConstruct.md}
                  lg={gridConstruct.lg}
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
                <Grid item
                  pt={gridConstruct.pt}
                  xs={gridConstruct.xs}
                  sm={gridConstruct.sm}
                  md={gridConstruct.md}
                  lg={gridConstruct.lg}
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

export default ProfilePersonal;
