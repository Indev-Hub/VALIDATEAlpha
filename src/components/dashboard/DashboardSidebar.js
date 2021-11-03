import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  // Button,
  Divider,
  Drawer,
  Hidden,
  Link,
  Typography
} from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
// import ReceiptIcon from '@material-ui/icons/Receipt';
// import BriefcaseIcon from '../../icons/Briefcase';
// import CalendarIcon from '../../icons/Calendar';
// import ChartPieIcon from '../../icons/ChartPie';
// import ChartSquareBarIcon from '../../icons/ChartSquareBar';
// import ChatAltIcon from '../../icons/ChatAlt';
// import ClipboardListIcon from '../../icons/ClipboardList';
// import FolderOpenIcon from '../../icons/FolderOpen';
// import MailIcon from '../../icons/Mail';
// import ShareIcon from '../../icons/Share';
// import ShoppingBagIcon from '../../icons/ShoppingBag';
// import ShoppingCartIcon from '../../icons/ShoppingCart';
import UserIcon from '../../icons/User';
// import UsersIcon from '../../icons/Users';
import {
  Archive,
  Clipboard,
  ClipboardList,
  IndevLogo1,
  Plus
} from '../../icons';
import Logo from '../Logo';
import NavSection from '../NavSection';
import Scrollbar from '../Scrollbar';
import { ConsoleLogger } from '@aws-amplify/core';
import { getUser } from 'src/graphql/queries';

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const { user } = useAuth();
  const [userCompanies, setUserCompanies] = useState([]);

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
    } catch (error) {
      console.log('error on fetching user companies', error);
    }
  };

  useEffect(() => {
    getUserCompanies();
  }, [])
  
  const createSections = (companies) => {

  
  return [
      {
        title: 'General',
        items: [
          {
            title: 'Overview',
            path: '/dashboard',
            // icon: <IndevLogo1 fontSize="small" />
          },
          // {
          //   title: 'Analytics',
          //   path: '/dashboard/analytics',
          //   icon: <ChartPieIcon fontSize="small" />
          // },
          // {
          //   title: 'Finance',
          //   path: '/dashboard/finance',
          //   icon: <ShoppingBagIcon fontSize="small" />
          // },
          {
            title: 'Account',
            path: '/dashboard/account',
            // icon: <UserIcon fontSize="small" />
          },
          {
            title: 'Profile',
            path: '/dashboard/profile',
            // icon: <UserIcon fontSize="small" />
          }
        ]
      },
      // {
      //   title: 'VALIDATE Tests',
      //   items: [
      //     {
      //       title: 'Customers',
      //       path: '/dashboard/customers',
      //       icon: <UsersIcon fontSize="small" />,
      //       children: [
      //         {
      //           title: 'List',
      //           path: '/dashboard/customers'
      //         },
      //         {
      //           title: 'Details',
      //           path: '/dashboard/customers/1'
      //         },
      //         {
      //           title: 'Edit',
      //           path: '/dashboard/customers/1/edit'
      //         }
      //       ]
      //     },
      //     {
      //       title: 'Products',
      //       path: '/dashboard/products',
      //       icon: <ShoppingCartIcon fontSize="small" />,
      //       children: [
      //         {
      //           title: 'List',
      //           path: '/dashboard/products'
      //         },
      //         {
      //           title: 'Create',
      //           path: '/dashboard/products/new'
      //         }
      //       ]
      //     },
      //     {
      //       title: 'Add Test',
      //       path: '/dashboard/test-create',
      //       icon: <Plus fontSize="small" />
      //     },
      //     {
      //       title: 'Test Collection',
      //       path: '/dashboard/test-list',
      //       icon: <Archive fontSize="small" />
      //     }
      //   ]
      // },
      // {
      //   title: 'VALIDATE Analytics',
      //   icon: <Plus fontSize="small" />,
      //   path: '/dashboard/orders',
      //   items: [
      //     {
      //       title: 'Add Test',
      //       path: '/dashboard/test-create',
      //       icon: <Plus fontSize="small" />
      //     },
      //     {
      //       title: 'Test Collection',
      //       path: '/dashboard/test-list',
      //       icon: <Archive fontSize="small" />
      //     }
      //   ]
      // },
      {
        title: 'Company',
        items: [
          {
            title: companies.length > 0 ? 'Company' : '+ Add Company',
            // title: 'Company',
            path: companies.length > 0 ? '/dashboard/company' : '/dashboard/company/new'
            // icon: <Plus fontSize="small" />
          },
          // {
          //   title: 'Add Company',
          //   path: '/dashboard/company/new',
          //   icon: <Plus fontSize="small" />
          // },
          {
            title: 'Form Collection',
            path: '/dashboard/company/forms',
            // icon: <Archive fontSize="small" />
          },
          {
            title: 'Add Form',
            path: '/dashboard/test-create',
            icon: <Plus fontSize="small" />
          },
    
          // {
          //   title: 'Validations',
          //   // icon: <Clipboard fontSize="small" />,
          //   path: '/dashboard/orders',
          //   children: [
          //     {
          //       title: 'Add Form',
          //       path: '/dashboard/test-create',
          //       icon: <Plus fontSize="small" />
          //     },
          //     {
          //       title: 'Form Collection',
          //       path: '/dashboard/form-collection',
          //       // icon: <Archive fontSize="small" />
          //     }
          //   ]
          // }
        ]
      },
      {
        title: 'Add Form',
        path: '/dashboard/form-create',
        icon: <Plus fontSize="small" />
      },

      // {
      //   title: 'Platforms',
      //   items: [
      //     {
      //       title: 'Projects',
      //       path: '/dashboard/projects',
      //       icon: <BriefcaseIcon fontSize="small" />,
      //       children: [
      //         {
      //           title: 'Browse',
      //           path: '/dashboard/projects/browse'
      //         },
      //         {
      //           title: 'Details',
      //           path: '/dashboard/projects/1'
      //         },
      //         {
      //           title: 'Create',
      //           path: '/dashboard/projects/new'
      //         }
      //       ]
      //     },
      //     {
      //       title: 'Social',
      //       path: '/dashboard/social',
      //       icon: <ShareIcon fontSize="small" />,
      //       children: [
      //         {
      //           title: 'Profile',
      //           path: '/dashboard/social/profile'
      //         },
      //         {
      //           title: 'Feed',
      //           path: '/dashboard/social/feed'
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   title: 'Apps',
      //   items: [
      //     {
      //       title: 'Kanban',
      //       path: '/dashboard/kanban',
      //       icon: <ClipboardListIcon fontSize="small" />
      //     },
      //     {
      //       title: 'Mail',
      //       path: '/dashboard/mail',
      //       icon: <MailIcon fontSize="small" />
      //     },
      //     {
      //       title: 'Chat',
      //       path: '/dashboard/chat',
      //       icon: <ChatAltIcon fontSize="small" />
      //     },
      //     {
      //       title: 'Calendar',
      //       path: '/dashboard/calendar',
      //       icon: <CalendarIcon fontSize="small" />
      //     }
      //   ]
      // }
    ];
  }

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
          {createSections(userCompanies).map((section, idx) => (
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
        {/* <Box sx={{ p: 2 }}>
          <Typography
            color="textPrimary"
            variant="subtitle2"
          >
            Need Help?
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            Check our docs
          </Typography>
          <Button
            color="primary"
            component={RouterLink}
            fullWidth
            sx={{ mt: 2 }}
            to="/docs"
            variant="contained"
          >
            Documentation
          </Button>
        </Box> */}
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
