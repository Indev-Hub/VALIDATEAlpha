import React from 'react'

// The below functions were to test out whether stringifying an entire object array would then parse the whole array.
// This was necessary since the answers are being returned as strings but the rest of the array is an object.
// Unfortunately it turns out that it does not so the functions may no longer have any use...


export const jsonParse = (array) => {
  const newArray = JSON.stringify(array);
  console.log('string', newArray)
  const newerArray = JSON.parse(newArray);
  console.log('object', newerArray)
  return newerArray
};

export const jsonString = (array) => {
  const newArray = JSON.stringify(array);
  return newArray
};