import React, { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Grid, Typography } from '@material-ui/core';
import { Delete, Edit, ExpandMore } from '@material-ui/icons';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { deleteCompany } from '../../../graphql/mutations'
import DeleteIcon from '@material-ui/icons/Delete';
import Notification from '../../../components/form/Notification';


const CompanyDashboardTemplate = (props) => {
  const { company } = props;
  const [expanded, setExpanded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: ''
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subtitle: ''
  })

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const companyDelete = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteCompany, {input: { id: id }}));
      setNotify({
        isOpen: true,
        message: 'Deleted Successfully',
        type: 'success'
      });
      window.location.reload(false);
    } catch (error) {
      setNotify({
        isOpen: true,
        message: `Failed to Delete ${error}`,
        type: 'error'
      });
      console.log('error deleting company', error)
    }
  }

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          // expandIcon={<ExpandMore />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{
            backgroundColor: expanded ? 'standard.secondary' : 'standard.secondary',
            borderRadius: expanded ? '0px' : 'inherit',
            color: 'text.light'
          }}
        >
          <Box
            p={expanded ? 1 : 1}
          >
            <Typography variant="h6">{company.name}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container p={2} justifyContent="space-between">
            <Grid item>
              <Typography variant="h7" fontWeight={600} sx={{ textTransform: 'uppercase'}}>Description</Typography>
              <Typography>{company.description}</Typography>
            </Grid>
            <Grid item>
              <Edit />
              <IconButton />
                <DeleteIcon onClick={() => companyDelete(company.id)}/>
              <Notification
          notify={notify}
          setNotify={setNotify}
        />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default CompanyDashboardTemplate
