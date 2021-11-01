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
    padding: theme.spacing(2),
    backgroundColor: 'background.default',
    fontSize: 12,
    width: '25%'
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
    <Card
      sx={{
        height: '100%',
        backgroundColor: 'background.paperPersist',
        border: 8,
        borderColor: 'background.paperPersist'
        // padding:2
      }}>
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
                    color: 'text.contrastPersist',
                    backgroundColor: 'standard.primary',
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
        sx={{
          backgroundColor: 'background.paperPersist',
          p:2
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: 'text.primaryPersist',
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
              color: 'text.primaryPersist',
              fontWeight: 500
            }}
          >
            {form.company ? form.company.name : 'NO COMPANY'}
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
            color="text.primaryPersist"
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
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography fontSize='1.2em' fontWeight='500'>{form.description}</Typography>
          </Popover>
        </Box>
        <Divider sx={{ backgroundColor: 'background.contrastPersist', mt:4 }} />
        <Box align="center" sx={{ mt:-1.3, mb:4}}>
          <Typography variant="h8" sx={{ color: 'text.contrastPersist', backgroundColor: 'background.contrastPersist', px: 2, py: .5, borderRadius: 2 }}>
            Submissions: {countSubmissions}
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

export default BrowseForms
