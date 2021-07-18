/* eslint-disable */
import { Typography } from '@material-ui/core';
import React from 'react';

const FormElement = (props) => {
  const { dataType } = props;
  props.dataType=="True";
  // const formSelect = () => (
  //   {dataType}
  // );
  return (
    <div>
      <Typography>{dataType} Hello</Typography>
    </div>
  )
}


export default FormElement
