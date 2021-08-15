import React, { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@material-ui/core';
import { Edit, ExpandMore } from '@material-ui/icons';

const CompanyDashboardTemplate = (props) => {
  const { company } = props;
  const [expanded, setExpanded] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default CompanyDashboardTemplate
