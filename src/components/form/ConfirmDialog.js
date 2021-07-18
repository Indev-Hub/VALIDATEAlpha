import {
  Avatar,
  Box,
  Button,
  Dialog,
  Typography,
} from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/WarningOutlined';

const useStyles = makeStyles(theme => ({
  dialog: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5)
  }
}));

const ConfirmDialog = props => {
  const { confirmDialog, setConfirmDialog } = props;
  const classes = useStyles();

  return (
    <Dialog open={confirmDialog.isOpen}>
      <Box
        sx={{
          display: 'flex',
          pb: 2,
          pt: 3,
          px: 3
        }}
      >
        <Avatar
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
            color: 'error.main',
            mr: 2
          }}
        >
          <WarningIcon />
        </Avatar>
        <Box>
          <Typography
            color="textPrimary"
            variant="h5"
          >
            {confirmDialog.title}
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ mt: 1 }}
            variant="body2"
          >
            {confirmDialog.subtitle}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          px: 3,
          py: 1.5
        }}
      >
        <Button
          color="primary"
          sx={{ mr: 2 }}
          variant="outlined"
          onClick={() => {
            setConfirmDialog({
              ...confirmDialog,
              isOpen: false,
            });
          }}
        >
          Cancel
        </Button>
        <Button
          sx={{
            backgroundColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
          variant="contained"
          onClick={confirmDialog.onConfirm}
        >
          {confirmDialog.buttonText}
        </Button>
      </Box>
    </Dialog>
  )
};

export default ConfirmDialog;
