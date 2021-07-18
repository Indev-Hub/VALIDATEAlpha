import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const Notification = props => {
  const { notify, setNotify } = props;

  const handleClose = () => {
    setNotify({
      ...notify,
      isOpen: false
    })
  }

  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert severity={notify.type}
        onClose={handleClose}
      >
        {notify.message}
      </Alert>
    </Snackbar>
  )
}

export default Notification;
