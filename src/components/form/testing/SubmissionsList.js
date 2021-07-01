import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listFormSubmissions } from 'src/graphql/queries';

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);

  const fetchSubmissions = async () => {
    try {
      const submissionsData = await API.graphql(graphqlOperation(listFormSubmissions));
      const submissionsList = submissionsData.data.listFormSubmissions.items;
      console.log('submissionsList:', submissionsList);
      setSubmissions(submissionsList);
      console.log('submissionsState:', submissions)
    } catch (error) {
      console.log('error on fetching submissions', error);
    }
  };

  return (
    <React.Fragment>
      <button onClick={fetchSubmissions}>Console Log Submissions</button>
    </React.Fragment>
  )
}

export default SubmissionsList;
