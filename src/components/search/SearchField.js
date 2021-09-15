import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  TextField,
} from "@material-ui/core";
import PropTypes from 'prop-types';


const SearchField = (props) => {
  const {
    string,
    setString,
    forms,
    setSelectedForms
  } = props;

  const applyFilters = (forms, string) => forms
  .filter((form) => {
    let matches = true;

    if (string) {
      // "properties" determines the fields that are searched 
      // for matching values in the string
      const properties = ['title', 'description', 'companyName'];
      let containsString = false;

      properties.forEach((property) => {
        if (form[property].toLowerCase().includes(string.toLowerCase())) {
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
    setSelectedForms(applyFilters(forms, string));

  },[forms, setSelectedForms, string])

  const handleStringChange = (event) => {
    setString(event.target.value);
  };

  return(
    <>
      <TextField
        onChange={handleStringChange}
      />
    </>
  )
}

SearchField.propTypes = {
  string: PropTypes.string,
  setString: PropTypes.func,
  forms: PropTypes.array,
  setSelectedForms: PropTypes.func
};

export default SearchField;