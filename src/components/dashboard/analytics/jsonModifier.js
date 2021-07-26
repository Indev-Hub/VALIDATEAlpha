import React from 'react'

export const jsonParse = (array) => {
  const newArray = JSON.stringify(array);
  // console.log('string', newArray)
  const newerArray = JSON.parse(newArray);
  // console.log('object', newerArray)
  return newerArray
};

export const jsonString = (array) => {
  const newArray = JSON.stringify(array);
  return newArray
};