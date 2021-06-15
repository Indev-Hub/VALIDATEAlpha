import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { Auth } from 'aws-amplify';

const RegisterAmplify = (props) => {
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();
  const { register } = useAuth();

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          name: '',
          family_name: '',
          email: '',
          password: '',
          policy: true,
          submit: null
        }}
        validationSchema={Yup
          .object()
          .shape({
            username: Yup
              .string()
              .min(3)
              .max(255)
              .required('Username is required'),			  
            name: Yup
              .string()
              .min(2)
              .max(255)
              .required('First Name is required'),
			family_name: Yup
              .string()
              .min(2)
              .max(255)
              .required('Last Name is required'),			  
			email: Yup
              .string()
              .email('Must be a valid email')
              .max(255)
              .required('Email is required'),			  
            password: Yup
              .string()
              .min(1)
              .max(255)
              .required('Password is required'),
            policy: Yup
              .boolean()
              .oneOf([true], 'This field must be checked')
          })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            Auth.signUp({
              'username': values.username,
              'password': values.password,
              'attributes': {
                'name': values.name,
                'family_name': values.family_name,
                'email': values.email,
              }
            })
            // console.log('user', user);
            // await register(values.username, values.name, values.family_name, values.email, values.password);

            navigate('/authentication/login', {
              state: {
                username: values.username
              }
            });
          } catch (err) {
            console.error(err);
            if (isMountedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            {...props}
          >
            <TextField
              error={Boolean(touched.username && errors.username)}
              fullWidth
              helperText={touched.username && errors.username}
              label="Display Name"
              margin="normal"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.username}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.name && errors.name)}
              fullWidth
              helperText={touched.name && errors.name}
              label="First Name"
              margin="normal"
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.name}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.family_name && errors.family_name)}
              fullWidth
              helperText={touched.family_name && errors.family_name}
              label="Last Name"
              margin="normal"
              name="family_name"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.family_name}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.password && errors.password)}
              fullWidth
              helperText={touched.password && errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
              variant="outlined"
            />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: -1,
                mt: 2
              }}
            >
              <Checkbox
                checked={values.policy}
                color="primary"
                name="policy"
                onChange={handleChange}
              />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                I have read the
                {' '}
                <Link
                  color="primary"
                  component="a"
                  href="#"
                >
                  Terms and Conditions
                </Link>
              </Typography>
            </Box>
            {Boolean(touched.policy && errors.policy) && (
              <FormHelperText error>
                {errors.policy}
              </FormHelperText>
            )}
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>
                  {errors.submit}
                </FormHelperText>
              </Box>
            )}
            <Box sx={{ mt: 2 }}>
              <Button
                color="primary"
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Register
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default RegisterAmplify;
