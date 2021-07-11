import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listForms } from 'src/graphql/queries';

const FormsList = () => {
  const [forms, setForms] = useState([]);

  const fetchForms = async () => {
    try {
      const formsData = await API.graphql(graphqlOperation(listForms));
      const formsList = formsData.data.listForms.items;
      console.log('formsList:', formsList);
      setForms(formsList);
      console.log('formsState:', forms)
    } catch (error) {
      console.log('error on fetching forms', error);
    }
  };

  return (
    <React.Fragment>
      <button onClick={fetchForms}>Console Log Forms</button>
    </React.Fragment>
  )
}

export default FormsList;
