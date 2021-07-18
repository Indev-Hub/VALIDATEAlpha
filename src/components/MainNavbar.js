import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Chip,
  Divider,
  Hidden,
  IconButton,
  Link,
  Toolbar
} from '@material-ui/core';
import Amplify, { Auth } from 'aws-amplify';
import {
  // AmplifySignIn,
  AmplifySignInButton,
  AmplifySignOut
  // withAuthenticator
} from '@aws-amplify/ui-react';
import awsconfig from '../aws-exports';
import useAuth from 'src/hooks/useAuth';
import MenuIcon from '../icons/Menu';
import Logo from '../images/IconBlack.png';
import { Button } from '@material-ui/core';
import { useEffect, useState } from 'react';
import AccountPopover from './dashboard/AccountPopover';

Amplify.configure(awsconfig);

const MainNavbar = (props) => {
  const { onSidebarMobileOpen } = props;
  const { isAuthenticated } = useAuth();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
	  LoggedInState()
  }, [])

  const LoggedInState = () => {
	  Auth.currentAuthenticatedUser()
		  .then(() => {
			  setLoggedIn(true);
		  })
		  .catch(() => {
			  setLoggedIn(false);
		  })
  }

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.secondary'
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarMobileOpen}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Hidden>
        <Hidden lgDown>
          <RouterLink to="/">
            {/* <Logo
              sx={{
                height: 40,
                width: 40
              }}
            /> */}
            <img
              src={Logo}
              alt="Logo"
              width="50px"
            />
          </RouterLink>
        </Hidden>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden mdDown>
          <Link
            color="textSecondary"
            component={RouterLink}
            to="/browse"
            underline="none"
            variant="body1"
            sx={{
              mx:1
            }}
          >
            Browse Components
          </Link>
          <Link
            color="textSecondary"
            component={RouterLink}
            to="/docs"
            underline="none"
            variant="body1"
            sx={{
              mx:1
            }}
          >
            Documentation
          </Link>
      { isAuthenticated === false ? (
            <Link
              color="text.reverse"
              component={RouterLink}
              to="/authentication/login"
              underline="none"
              variant="body1"
            >
              Login
            </Link>
          ) : (
            <AccountPopover />
          )}
        </Hidden>
      </Toolbar>
      <Divider />
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func
};

export default MainNavbar;
