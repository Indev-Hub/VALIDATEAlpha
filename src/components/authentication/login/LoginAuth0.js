import { useState } from 'react';
import { Box, Button, FormHelperText } from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

const LoginAuth0 = (props) => {
  const isMountedRef = useIsMountedRef();
  const { loginWithPopup } = useAuth();
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      await loginWithPopup();
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        setError(err.message);
      }
    }
  };

  return (
    <div {...props}>
      {error && (
        <Box sx={{ my: 3 }}>
          <FormHelperText error>
            {error}
          </FormHelperText>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          color="primary"
          onClick={handleLogin}
          variant="contained"
        >
          Log In
        </Button>
      </Box>
    </div>
  );
};

export default LoginAuth0;
