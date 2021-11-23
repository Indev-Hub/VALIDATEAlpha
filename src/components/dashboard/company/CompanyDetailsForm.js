import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Formik, FieldArray } from "formik";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Chip,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { TAGS } from "./CompanyConstants.js";
import useAuth from "../../../hooks/useAuth";

const CompanyDetailsForm = (props) => {
  const {
    onBack,
    onNext,
    companyData,
    submit,
    handleCompanyChange,
    setCompanyData,
    ...other
  } = props;
  const [availableTags, setAvailableTags] = useState([]);
  const [tagsToAdd, setTagsToAdd] = useState([]);
  const { user } = useAuth();
  const userPlanDummyVariable = false;

  useEffect(() => {
    const addedTags = TAGS.filter((tag) => !tagsToAdd.includes(tag));
    setAvailableTags(addedTags);
    setCompanyData({
      ...companyData,
      tags: tagsToAdd,
    });
  }, [tagsToAdd]);

  useEffect(() => console.log(user), []);

  const addTag = (tag) => {
    setTagsToAdd([...tagsToAdd, tag]);
  };

  const removeTag = (tag) => {
    const newTags = tagsToAdd.filter((e) => e !== tag);
    setTagsToAdd(newTags);
  };

  return user.userTable.companies.items.length > 0 && user.plan != "Premium" ? (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "background.default",
        borderRadius: 1,
        display: "flex",
        overflow: "hidden",
        p: 2,
      }}
    >
      <Grid
        container
        height="50vh"
        display="column"
        justifyContent="center"
        alignContent="center"
      >
        <Grid
          item
          justifyContent="center"
          alignContent="center"
          xs={6}
          align="center"
        >
          <Typography color="textPrimary" variant="h4">
            You need a Premium account to create more than one company.
          </Typography>
          <Typography color="textSecondary" variant="h6">
            You can upgrade to Premium on the billing tab of your account page.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={RouterLink}
            to="/dashboard/account"
            sx={{
              mt: 2,
            }}
          >
            Account
          </Button>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Formik
      initialValues={{
        name: "",
        description: "",
        tags: [],
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .min(3, "Must be at least 3 characters")
          .max(255)
          .required("Required"),
        description: Yup.string().max(500, "Must be fewer than 500 characters"),
        tags: Yup.array(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          await handleCompanyChange(
            values.name,
            values.description,
            values.tags
          );
          setStatus({ success: true });
          setSubmitting(false);
          debugger;
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
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit} {...other}>
          <Card sx={{ p: 3 }}>
            <Typography color="textPrimary" variant="h6">
              Company details
            </Typography>
            <Typography color="textSecondary" variant="body1">
              We just need some basic information to add your company. Don't
              worry, you can always edit this information later on, too.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(touched.name && errors.name)}
                fullWidth
                helperText={touched.name && errors.name}
                label="Company Name"
                name="name"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  handleCompanyChange(e);
                }}
                value={values.name}
                variant="outlined"
              />
              <TextField
                error={Boolean(touched.description && errors.description)}
                fullWidth
                helperText={touched.description && errors.description}
                label="Company Description"
                name="description"
                multiline="true"
                maxRows="4"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  handleCompanyChange(e);
                }}
                value={values.description}
                variant="outlined"
                sx={{
                  mt: 2,
                }}
              />
              <Typography color="textPrimary" variant="h6">
                Choose tags:
              </Typography>
              <FieldArray name="tags">
                {({ push, remove }) => (
                  <Box sx={{ mt: 2 }}>
                    {availableTags.map((tags) => {
                      return (
                        <Chip
                          label={tags}
                          type="text"
                          id={tags}
                          className={tags}
                          value={tags}
                          sx={{
                            ml: 5,
                            mr: 5,
                            mb: 3,
                            p: 2,
                            width: 150,
                            borderColor: "white",
                            zIndex: 2,
                            color: "white",
                          }}
                          variant="outlined"
                          color="primary"
                          clickable
                          onClick={(e) => {
                            addTag(tags);
                            push(tags);
                          }}
                        />
                      );
                    })}
                    <Typography color="textPrimary" variant="h6">
                      Chosen tags:
                    </Typography>
                    {tagsToAdd.map((tag) => {
                      return (
                        <Chip
                          label={tag}
                          type="text"
                          id={tag}
                          className={tag}
                          value={tag}
                          sx={{
                            ml: 5,
                            mr: 5,
                            mb: 3,
                            p: 2,
                            zIndex: 2,
                            backgroundColor: "white",
                            color: "black",
                            "&: hover": {
                              color: "black",
                              cursor: "pointer",
                            },
                          }}
                          clickable
                          onClick={() => {
                            removeTag(tag);
                            remove(tag);
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              </FieldArray>
              {Boolean(touched.tags && errors.tags) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>{errors.tags}</FormHelperText>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: 6,
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
                onClick={submit}
                disabled={isSubmitting || errors.name || errors.description}
                type="submit"
                variant="contained"
              >
                Create Company
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

CompanyDetailsForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};

export default CompanyDetailsForm;
