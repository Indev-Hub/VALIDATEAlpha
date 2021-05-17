import PropTypes from 'prop-types';
import { addMinutes } from 'date-fns';
import merge from 'lodash/merge';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import MobileDateTimePicker from '@material-ui/lab/MobileDateTimePicker';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Switch,
  TextField,
  Typography
} from '@material-ui/core';
import TrashIcon from '../../../icons/Trash';
import { createEvent, deleteEvent, updateEvent } from '../../../slices/calendar';
import { useDispatch } from '../../../store';

const getInitialValues = (event, range) => {
  if (event) {
    return merge({}, {
      allDay: false,
      color: '',
      description: '',
      end: addMinutes(new Date(), 30),
      start: new Date(),
      title: '',
      submit: null
    }, event);
  }

  if (range) {
    return merge({}, {
      allDay: false,
      color: '',
      description: '',
      end: new Date(range.end),
      start: new Date(range.start),
      title: '',
      submit: null
    }, event);
  }

  return {
    allDay: false,
    color: '',
    description: '',
    end: addMinutes(new Date(), 30),
    start: new Date(),
    title: '',
    submit: null
  };
};

const CalendarEventForm = (props) => {
  const { event, onAddComplete, onCancel, onDeleteComplete, onEditComplete, range } = props;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(event.id));

      if (onDeleteComplete) {
        onDeleteComplete();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isCreating = !event;

  return (
    <Formik
      initialValues={getInitialValues(event, range)}
      validationSchema={Yup
        .object()
        .shape({
          allDay: Yup.bool(),
          description: Yup.string().max(5000),
          end: Yup
            .date()
            .when('start',
              (start, schema) => (start && schema.min(start,
                'End date must be later than start date'))),
          start: Yup.date(),
          title: Yup
            .string()
            .max(255)
            .required('Title is required')
        })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
          const data = {
            allDay: values.allDay,
            description: values.description,
            end: values.end,
            start: values.start,
            title: values.title
          };

          if (event) {
            await dispatch(updateEvent(event.id, data));
          } else {
            await dispatch(createEvent(data));
          }

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Calendar updated', {
            anchorOrigin: {
              horizontal: 'right',
              vertical: 'top'
            },
            variant: 'success'
          });

          if (isCreating && onAddComplete) {
            onAddComplete();
          }

          if (!isCreating && onEditComplete) {
            onEditComplete();
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
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="textPrimary"
              gutterBottom
              variant="h5"
            >
              {isCreating
                ? 'Add Event'
                : 'Edit Event'}
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <TextField
              error={Boolean(touched.title && errors.title)}
              fullWidth
              helperText={touched.title && errors.title}
              label="Title"
              name="title"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
              variant="outlined"
            />
            <Box sx={{ mt: 2 }}>
              <TextField
                error={Boolean(touched.description && errors.description)}
                fullWidth
                helperText={touched.description && errors.description}
                label="Description"
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                variant="outlined"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={(
                  <Switch
                    checked={values.allDay}
                    color="primary"
                    name="allDay"
                    onChange={handleChange}
                  />
                )}
                label="All day"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <MobileDateTimePicker
                label="Start date"
                onChange={(date) => setFieldValue('start', date)}
                renderInput={(inputProps) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...inputProps}
                  />
                )}
                value={values.start}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <MobileDateTimePicker
                label="End date"
                onChange={(date) => setFieldValue('end', date)}
                renderInput={(inputProps) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...inputProps}
                  />
                )}
                value={values.end}
              />
            </Box>
            {Boolean(touched.end && errors.end) && (
              <Box sx={{ mt: 2 }}>
                <FormHelperText error>
                  {errors.end}
                </FormHelperText>
              </Box>
            )}
          </Box>
          <Divider />
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              p: 2
            }}
          >
            {!isCreating && (
              <IconButton onClick={() => handleDelete()}>
                <TrashIcon fontSize="small" />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="primary"
              onClick={onCancel}
              variant="text"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={isSubmitting}
              sx={{ ml: 1 }}
              type="submit"
              variant="contained"
            >
              Confirm
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

CalendarEventForm.propTypes = {
  // @ts-ignore
  event: PropTypes.object,
  onAddComplete: PropTypes.func,
  onCancel: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func,
  // @ts-ignore
  range: PropTypes.object
};

export default CalendarEventForm;
