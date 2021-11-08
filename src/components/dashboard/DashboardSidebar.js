import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { API } from 'aws-amplify';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  Typography
} from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import { Plus } from '../../icons';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';
import { getUser } from '../../graphql/queries';

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const { user } = useAuth();
  const [userCompanies, setUserCompanies] = useState([]);
  const [isCompaniesLoaded, setIsCompaniesLoaded] = useState(false);

  const getUserCompanies = async () => {
    try {
      const fetchedUserData = await API.graphql({
        query: getUser,
        variables: { id: user.id }
      });
      const companies = fetchedUserData.data.getUser.companies.items;
      const companyNames = [];
      companies.forEach(company => {
        companyNames.push(company.name)
      })
      setUserCompanies(companyNames);
      setIsCompaniesLoaded(!isCompaniesLoaded)
    } catch (error) {
      console.log('error on fetching user companies', error);
    }
  };

  useEffect(() => {
    getUserCompanies();
  }, [])

  const sections = [
    {
      title: 'General',
      items: [
        {
          title: 'Overview',
          path: '/dashboard',
        },
        {
          title: 'Account',
          path: '/dashboard/account',
        },
        {
          title: 'Profile',
          path: '/dashboard/profile',
        }
      ]
    },
    {
      title: 'Company',
      items: [
        isCompaniesLoaded &&
        {
          title: userCompanies.length > 0 ? 'Company' : 'Add Company',
          path: userCompanies.length > 0 ? '/dashboard/company' : '/dashboard/company/new',
          icon: userCompanies.length > 0 ? null : <Plus fontSize="small" />
        },
        {
          title: 'Form Collection',
          path: '/dashboard/company/forms',
        },
        {
          title: 'Add Form',
          path: '/dashboard/form-create',
          icon: <Plus fontSize="small" />
        },
      ]
    },
    {
      items: [
        {
          title: 'ANALYTICS',
          path: '/dashboard/validation'
        }
      ]
    }
  ];


  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname, onMobileClose, openMobile]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 2
            }}
          >
            <RouterLink to="/">
              <Logo
                sx={{
                  height: 40,
                  width: 40
                }}
              />
            </RouterLink>
          </Box>
        </Hidden>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'background.default',
              borderRadius: 1,
              display: 'flex',
              overflow: 'hidden',
              p: 2
            }}
          >
            <RouterLink to="/dashboard/account">
              <Avatar
                src={user.avatar}
                sx={{
                  cursor: 'pointer',
                  height: 48,
                  width: 48
                }}
              />
            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                {user.name}
              </Typography>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Your plan:
                {' '}
                <Link
                  color="primary"
                  component={RouterLink}
                  to="/pricing"
                >
                  {user.plan}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section, idx) => (
            <NavSection
              key={idx}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3
                }
              }}
              {...section}
            />
          ))}
        </Box>
        <Divider />
      </Scrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              width: 280
            }
          }}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              height: 'calc(100% - 64px) !important',
              top: '64px !Important',
              width: 280
            }
          }}
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default DashboardSidebar;
