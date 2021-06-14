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
import Amplify from 'aws-amplify';
import {
  // AmplifySignIn,
  AmplifySignInButton,
  AmplifySignOut
  // withAuthenticator
} from '@aws-amplify/ui-react';
import awsconfig from '../aws-exports';
import MenuIcon from '../icons/Menu';
import Logo from '../images/IconBlack.png';

Amplify.configure(awsconfig);

const MainNavbar = (props) => {
  const { onSidebarMobileOpen } = props;

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
          >
            Browse Components
          </Link>
          <Chip
            color="primary"
            label="NEW"
            size="small"
            sx={{
              maxHeight: 20,
              ml: 1,
              mr: 2
            }}
          />
          <Link
            color="textSecondary"
            component={RouterLink}
            to="/docs"
            underline="none"
            variant="body1"
          >
            Documentation
          </Link>
          <AmplifySignOut />
          <AmplifySignInButton />
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
