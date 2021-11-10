import React, {useEffect} from 'react';
import {
  Box,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import PropTypes from 'prop-types';
import SearchIcon from '../../icons/Search';

const SearchField = (props) => {
  const {
    stringQuery,
    setString,
    forms,
    setSelectedForms,
    tagsToFilter,
    matchCase,
  } = props;

  const applyFilters = (forms, stringQuery, tagsToFilter, matchCase) => forms.filter((form) => {
    let matches = true;

    if (stringQuery) {
      // The "properties" variable determines the fields that are searched 
      const properties = ['title', 'description', 'companyName'];
      let containsString = false;

      properties.forEach((property) => {
        if (form[property].toLowerCase().includes(stringQuery.toLowerCase())) {
          containsString = true;
        }
      });

      if (!containsString) {
        matches = false;
      }
    };
    
    // Check matchCase for truthiness to filter by all/some tags
    if(tagsToFilter.length !== 0){
      if (!tagsToFilter.every(tag => form.tags.includes(tag)) && !matchCase) {
        matches = false;
      } else if (!tagsToFilter.some(tag => form.tags.includes(tag)) 
        && matchCase){
          matches = false;
      };
    } 
      
    return matches;
  });

  useEffect(() => {
    setSelectedForms(applyFilters(forms, stringQuery, tagsToFilter, matchCase));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[stringQuery, tagsToFilter, matchCase])

  const handleStringChange = (event) => {
    setString(event.target.value);
  };

  return(
    <>
      <Box
        sx={{
          m: 1,
          maxWidth: '100%',
          minWidth: 400,
          display: 'flex',
          justifycontent: 'center'
        }}
      >
        <TextField
          sx={{
            maxWidth: '100%',
            display: 'flex',
            color: 'white'
          }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          onChange={handleStringChange}
          placeholder="Search forms"
          value={stringQuery}
          variant="outlined"
        />
      </Box>
    </>
  )
}

SearchField.propTypes = {
  stringQuery: PropTypes.string,
  setString: PropTypes.func,
  forms: PropTypes.array,
  setSelectedForms: PropTypes.func,
  tagsToFilter: PropTypes.array,
  matchCase: PropTypes.bool,
};

export default SearchField;
