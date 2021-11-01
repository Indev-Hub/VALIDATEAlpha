import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Card,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@material-ui/core';

const selectOptions = {

    education: [
      {label: 'The Streets', value: 'theStreets'},
      {label: 'High School', value: 'highSchool'},
      {label: 'College', value: 'college'},
      {label: 'Bachelors', value: 'bachelors'},
      {label: 'Masters', value: 'masters'},
      {label: 'Doctorate', value: 'doctorate'}
    ],
    
    industry: [
      {label: '', value: ''},
      {label: '', value: ''},
      {label: '', value: ''},
      {label: '', value: ''}
    ],

    jobTitle: [
      {label: '', value: ''},
      {label: '', value: ''},
      {label: '', value: ''},
      {label: '', value: ''}
    ],

    employment: [
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

const ProfileOccupation = (props) => {
  // Destructure props
  const { profileData, handleProfileChange, setProfileData } = props;
  const { onBack, onNext, ...other } = props;
  const [tag, setTag] = useState('');
  console.log('profile DATA:', profileData);

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

  return (
    <Formik
      initialValues={{
        education: '',
        industry: '',
        jobTitle: '',
        salary: '',
        employment: '',
        submit: null
      }}
      validationSchema={Yup
        .object()
        .shape({
          education: Yup
            .string(),
          industry: Yup
            .string(),
          jobTitle: Yup
            .string(),
          salary: Yup
            .string(),
          employment: Yup
            .string(),
          children: Yup
            .number(),
          pets: Yup
            .array()
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
              Occupational Details
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
            >
              Information about your work and career.
            </Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item
                pt={gridConstruct.pt}
                xs={gridConstruct.xs}
                sm={gridConstruct.sm}
                md={gridConstruct.md}
                lg={gridConstruct.lg}
              >
                <TextField
                  fullWidth
                  label="Education"
                  name="education"
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleProfileChange}
                >
                  {selectOptions.education.map((education) => (
                    <option
                      key={education.value}
                      value={education.value}
                    >
                      {education.label}
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
                  label="Industry"
                  name="industry"
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  onChange={handleProfileChange}
                >
                  {selectOptions.industry.map((industry) => (
                    <option
                      key={industry.value}
                      value={industry.value}
                    >
                      {industry.label}
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
                    label="Job Title"
                    name="jobTitle"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    onChange={handleProfileChange}
                  >
                    {selectOptions.jobTitle.map((jobTitle) => (
                      <option
                        key={jobTitle.value}
                        value={jobTitle.value}
                      >
                        {jobTitle.label}
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
                    label="Employment"
                    name="employment"
                    color="success"
                    select
                    SelectProps={{ native: true }}
                    variant="outlined"
                    onChange={handleProfileChange}
                  >
                    {selectOptions.employment.map((employment) => (
                      <option
                        key={employment.value}
                        value={employment.value}
                      >
                        {employment.label}
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
                    label="Salary"
                    placeholder="Annual Salary"
                    name="salary"
                    color="success"
                    type="number"
                    variant="outlined"
                    value={profileData.salary}
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
                      id="demo-multiple-checkbox"
                      multiple
                      value={petArray}
                      onChange={handleArrayChange}
                      input={<OutlinedInput label="Pets" />}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {selectOptions.pets.map((name) => (
                        <MenuItem key={name.value} value={name.value}>
                          <Checkbox checked={petArray.indexOf(name.value) > -1} />
                          <ListItemText primary={name.value} />
                          {console.log(petArray)}
                          {console.log(profileData)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Card>
          </form>
      )}
    </Formik>
  );

};

export default ProfileOccupation;
