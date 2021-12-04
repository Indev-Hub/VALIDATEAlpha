import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import { API, graphqlOperation } from 'aws-amplify';
import ConfirmDialog from '../../../components/form/ConfirmDialog';
import Notification from '../../../components/form/Notification';
import { deleteCompany, updateCompany } from '../../../graphql/mutations';
import CompanyEditInfo from './_company-edit/CompanyEditInfo';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TabProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const CompanyDashboardTemplate = (props) => {
  const { company } = props;
  const [companyInfo, setCompanyInfo] = useState(company);
  console.log('company', companyInfo);
  const [expanded, setExpanded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // edit state slice preserved for future functionality
  // const [edit, setEdit] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
  });

  const tags = JSON.parse(company.tags);

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const companyDelete = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteCompany, { input: { id: id } }));
      setNotify({
        isOpen: true,
        message: 'Deleted Successfully',
        type: 'success',
      });
    } catch (error) {
      setNotify({
        isOpen: true,
        message: `Failed to Delete ${error}`,
        type: 'error',
      });
      console.log('error deleting company', error);
    }
  };

  const handleCompanyDelete = () => {
    companyDelete(company.id);
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setTimeout(() => window.location.reload(false), 600);
  };

  const companyUpdate = async () => {
    try {
      console.log('company id', company.id)
      // NOTE: Make API request
      const updateCompanyInput = {
        id: companyInfo.id,
        name: companyInfo.name,
        description: companyInfo.description
      };
      console.log('company info before', updateCompanyInput);
      // Error occurring here:
      const upProj = await API.graphql(graphqlOperation(updateCompany, { input: updateCompanyInput }));
      console.log('company info after', upProj.data);
    } catch (error) {
      console.error(error);
      console.log('Error on updating company', error);
    }
  }

  const handleEdit = () => {
    edit == false ? setEdit(true) : setEdit(false);
    console.log('edit', edit);
  }

  const handleFieldChange = (e) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          // expandIcon={<ExpandMore />}
          aria-controls='panel1bh-content'
          id='panel1bh-header'
          sx={{
            backgroundColor: expanded
              ? 'standard.secondary'
              : 'standard.secondary',
            borderRadius: expanded ? '16px 16px 0 0' : 'inherit',
            color: 'text.light',
          }}
        >
          <Box p={expanded ? 1 : 1}>
            <Typography variant='h6'>{company.name}</Typography>
          </Box>
        </AccordionSummary>
        {edit ? (
          <AccordionDetails>
            <Grid container
              sx={{ flexGrow: 1, bgcolor: 'background.paper'}}
            >
              <Grid item xs={3}>
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleTabChange}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                  <Tab label="Info" {...TabProps(0)} />
                  <Tab label="Market" {...TabProps(1)} />
                  <Tab label="Forms" {...TabProps(2)} />
                </Tabs>
              </Grid>
              <Grid item xs={9}>
                <TabPanel value={value} index={0}>
                  <CompanyEditInfo company={company} companyInfo={companyInfo} handleFieldChange={handleFieldChange} companyUpdate={companyUpdate} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                  Item Three
                </TabPanel>
              </Grid>
            </Grid>
          </AccordionDetails>
        ) : (
          <AccordionDetails>
            <Grid container p={2} justifyContent='space-between'>
              <Grid item>
                <Typography
                  variant='h7'
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase' }}
                >
                  Description
                </Typography>
                <Typography>{company.description}</Typography>
              </Grid>
              <Grid item>
              <Typography
                  variant='h7'
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase' }}
                >
                  Tags
                </Typography>
                <Typography>
                  {tags[0] !== ''
                    ? tags.map((tag, _index) => (
                        <>
                          <Chip
                            sx={{
                              color: 'white',
                              backgroundColor: 'blue',
                              fontSize: '9.5px',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '.5px',
                              px: 1,
                              mx: 0.25,
                            }}
                            size='small'
                            label={tag}
                          />
                        </>
                      ))
                    : null}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={handleEdit}>
                  <Edit />
                </IconButton>
                <Tooltip title='Delete Company'>
                  <IconButton>
                    <DeleteIcon
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Delete company',
                          subtitle: `Are you sure you want to delete this 
                          company? It will be permanently removed, and access
                          to forms associated with the company will be lost.`,
                          // text accurate to current build but should be updated
                          // when relational database functionality is changed
                          buttonText: 'Delete',
                          onConfirm: handleCompanyDelete,
                        });
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Notification notify={notify} setNotify={setNotify} />
              </Grid>
            </Grid>
          </AccordionDetails>
        )}

      </Accordion>
      {confirmDialog.isOpen && (
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      )}
    </div>
  );
};

export default CompanyDashboardTemplate;
