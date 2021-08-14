import React from 'react';
import {
  Box,
  Card,
  Popover,
  Typography,
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
}));

const SearchForms = (props) => {
  const classes = useStyles();

  // Description Popover state
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Receive form data and index from search mapping in SearchMain component
  const { form, index } = props;
  console.log("SearchForms#form", form)

  // Parse first 3 tags from form data; mapped through below
  const tags = JSON.parse(form.tags).slice(0, 3);
  console.log("SearchForms#form.tags", tags)

  // Handle Popover display of full description
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Card style={{ height: '100%' }}>
      <Box
        style={{
          backgroundColor: 'black',
          background: `
            linear-gradient(
              90deg, 
              rgba(0, 0, 0, 1), 
              rgba(0, 0, 0, 0.3)), 
            url('https://source.unsplash.com/1900x900/?${form.title}')`,
          backgroundSize: 'cover',
        }}
      >
        <Typography
          className={classes.singleLine}
          variant="h5"
          sx={{
            pl: 2,
            pt: 1,
            color: 'white',
            textShadow: '#000000 4px 2px 6px'
          }}
        >
          {form.title}
        </Typography>
        <Typography
          className={classes.singleLine}
          sx={{
            pl: 2,
            pb: 1,
            color: 'white',
            textShadow: '#000000 4px 2px 6px'
          }}
        >
          {form.company.name}
        </Typography>
      </Box>
      <Box
        sx={{ p: 2 }}
      >
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
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
        <Box mt={1}>
          {tags[0] !== "" ? (
            tags.map((tag, _index) => (
              <Typography
                display="inline"
                sx={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: 'blue',
                  borderRadius: '60px',
                  px: 2,
                  py: .5,
                  mr: 0.5,
                }}
              >
                {tag}
              </Typography>
            ))
          ) : (
            null
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default SearchForms;
