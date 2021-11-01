import React, { useState } from 'react'
import {
  Box,
  Card,
  Chip,
  Divider,
  Popover,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  // Limit title and description to one line; truncate with ellipsis
  singleLine: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  // Description Popover styles (popover, paper)
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
    backgroundColor: '#d3d3d3',
    width: '25%',
  },
  // Chip styling for tags
  chip: {
    margin: theme.spacing(0.5),
  },
  MuiChipLabel: {
    paddingLeft: '50px'
  }
}));

const BrowseForms = (props) => {
  const classes = useStyles();

  // Description Popover state
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Receive form data and index from search mapping in SearchMain component
  const { form, submissions} = props;

  // Parse first 3 tags from form data; mapped through below
  const tags = JSON.parse(form.tags).slice(0, 3);

  // Handle Popover display of full description
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Count submissions based on formID
  const [countSubmissions, setCountSubmissions] = useState('');
  const [subSet, setSubSet] = useState(false);

  if (submissions !== undefined && subSet === false) {
    const newSubmissions = submissions.filter(item => item.formID === form.id).length;
    setCountSubmissions(newSubmissions)
    setSubSet(true)     
  }  

  return (
    <Card style={{ height: '100%' }}>
      <Box
        style={{
          backgroundColor: 'black',
          backgroundImage: `url('https://source.unsplash.com/1900x900/?${form.title}')`,
          backgroundSize: 'cover',
          height: '150px'
        }}
      >
        <Box align="right" p={2}>
          {tags[0] !== "" ? (
            tags.map((tag, _index) => (
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
                    mx: .25
                  }}
                  size="small"
                  label={tag} />
              </>
            ))
          ) : (
            null
          )}
        </Box>
      </Box>
      <Box
        sx={{ p:2 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: 'text.primary',
              fontWeight: 500
            }}
          >{form.title}
          </Typography>
          <Typography
            variant="h7"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            sx={{
              pb: 2,
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            {/* {form.company.name} */}
            {form.company ? form.company.name : 'DELETE THIS FORM'}
          </Typography>
        </Box>
        <Box
          height={40}
          maxHeight={40}
          mt={1}
          overflow="hidden"
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <Typography
            className={classes.singleLine}
            lineHeight={'1.2em'}
            height={'2em'}
          >
            {form.description}
          </Typography>
          <Popover
            id="mouse-over-popover"
            className={classes.popover}
            classes={{
              paper: classes.paper,
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography fontSize='1.2em'>{form.description}</Typography>
          </Popover>
        </Box>
        <Divider sx={{ color: 'background.dark', mt:4 }} />
        <Box align="center" sx={{ mt:-1.3, mb:4}}>
          <Typography variant="h8" sx={{ color: 'text.light', backgroundColor: 'background.dark', px: 2, py: .5, borderRadius: 2 }}>
            Submissions: {countSubmissions}
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

export default BrowseForms
