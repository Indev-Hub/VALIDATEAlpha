import React, {useEffect} from 'react';
import {
  Box,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import PropTypes from 'prop-types';
import SearchIcon from 'src/icons/Search';



const SearchField = (props) => {
  const {
    stringQuery,
    setString,
    forms,
    setSelectedForms,
    tagsToFilter
  } = props;

  const applyFilters = (forms, stringQuery, tagsToFilter) => forms.filter((form) => {
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
    
    if(tagsToFilter){
      if (!tagsToFilter.every(tag => form.tags.includes(tag))) {
        matches = false;
      };
    }

    return matches;
  });

  useEffect(() => {
    setSelectedForms(applyFilters(forms, stringQuery, tagsToFilter));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[stringQuery, tagsToFilter])

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
  tagsToFilter: PropTypes.array
};

export default SearchField;