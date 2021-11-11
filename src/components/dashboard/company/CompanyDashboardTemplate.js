import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box, Grid, IconButton, Tooltip, Typography
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import { API, graphqlOperation } from 'aws-amplify';
import ConfirmDialog from '../../../components/form/ConfirmDialog';
import Notification from '../../../components/form/Notification';
import { deleteCompany } from '../../../graphql/mutations';

const CompanyDashboardTemplate = (props) => {
  const { company } = props;
  const [expanded, setExpanded] = useState(false);
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
            borderRadius: expanded ? '0px' : 'inherit',
            color: 'text.light',
          }}
        >
          <Box p={expanded ? 1 : 1}>
            <Typography variant='h6'>{company.name}</Typography>
          </Box>
        </AccordionSummary>
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
              <IconButton>
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
