import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import PropTypes from 'prop-types';
import SearchIcon from 'src/icons/Search';
import { property } from 'lodash';



const SearchField = (props) => {
  const {
    stringQuery,
    setString,
    forms,
    setSelectedForms
  } = props;

  const applyFilters = (forms, stringQuery) => forms
  .filter((form) => {
    let matches = true;

    if (stringQuery) {
      // "properties" determines the fields that are searched 
      // for matching values in the string
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
    }

    return matches;
  });

  useEffect(() => {
    setSelectedForms(applyFilters(forms, stringQuery));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[stringQuery])

  const handleStringChange = (event) => {
    setString(event.target.value);
  };

  return(
    <>
      <Box
        sx={{
          m: 1,
          maxWidth: '100%',
          width: 500,
          display: 'flex',
          justifycontent: 'center'
        }}
      >
        <TextField
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
  setSelectedForms: PropTypes.func
};

export default SearchField;