import * as React from 'react';
import ReactJson from 'react-json-view';

export default function({data}) {
  const newData = JSON.parse(data);
  return (
    <div style={{marginTop: '30px'}}>
        <ReactJson src={newData} />
    </div>
  )
}