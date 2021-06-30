/* eslint-disable */
import { TextField } from '@material-ui/core';
import React from 'react';

function FormSelector() {
  const renderFields = (fields) => (
    <div>
      <div className="input-row">
        <label>Category:</label>
        <select {...fields.category.input}>
          <option value="foo">Some option</option>
        </select>
      </div>
      { fields.category.input.value && (
        <div className="input-row">
          <label>Sub category</label>
          <select {...fields.subcategory.input}>
            <option value="foo">Some other option</option>
          </select>
        </div>
      )}
    </div>
  )
  
  return (
    <div>
    </div>
  );
}

export default FormSelector;
