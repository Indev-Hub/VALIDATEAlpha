/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { createCompany, createForm } from '../../../graphql/mutations';
// import { v4 as uuid } from 'uuid';
import Amplify, { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import {

	IconButton,
	TextField,
	Box
} from '@material-ui/core';
import { uniqueId } from 'lodash';
import { Publish } from '@material-ui/icons';

const VideoAdd = ({ onUpload }) => {
	const [videoData, setVideoData] = useState({});
	const [formatData, setformatData] = useState();

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState('');
	const [userName, setUserName] = useState('');

	useEffect(() => {
	  try {
		setError(null);
		setLoading(true);
  
		Auth.currentAuthenticatedUser({
		  bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
		}).then(user => {
		  setUserId(user.signInUserSession.accessToken.payload.sub);
		  setUserName(user.signInUserSession.accessToken.payload.username);
		//   console.log(`Load additional settings for ID: ${userId}`);
		  // console.log('user', Auth.currentAuthenticatedUser());
		}).catch(err => setError(err));
	  }
	  catch (e) {
		setError(e);
	  }
	  finally {
		setLoading(false);
	  }
	}, []);


  const uploadVideo = async () => {
		//Get user attributes
		const { signInUserSession } = await Auth.currentAuthenticatedUser();
		const userName = signInUserSession.accessToken.payload.username;
		const userId = signInUserSession.accessToken.payload.sub

		console.log('user name', userName);
		console.log('user id', userId);

		//Upload the video
		const formID = uniqueId();

		const formArray = [
			{
				"type": "int",
				"question": "How old are you?",
				"options": "/[int]/",
			},
			{
				"type": "text",
				"question": "Where were you born?",
				"options": "/String/",
			},
			{
				"type": "img",
				"question": "Which image is your favorite?",
				"options": "[img]",
			}
		]

		console.log('unique id', formID)
		console.log('videoData', videoData);
		const { title, description, showcase, order, ownerName, ownerId } = videoData;
		// const { key } = await Storage.put(`${userId}/${title}_${videoId}.mp4`, formatData, { contentType: 'video/*' });

		const createCompanyInput = {
			id: `company-${formID}`,
			title: 'Company Name',
			userID: '56-55-54'
		};

		const createFormInput = {
			id: `form-${formID}`,
			companyID: 'company-2',
			question01: 'What is your favorite day?',
			answer01: JSON.stringify(formArray)
		};

		// await API.graphql(graphqlOperation(createCompany, { input: createCompanyInput }));
		await API.graphql(graphqlOperation(createForm, { input: createFormInput }));
		console.log('videoData', videoData);

		// onUpload();
	};

    return (
		<Box>
            <TextField
                label="Company"
                value={videoData.company}
                onChange={e => setVideoData({ ...videoData, company: e.target.value })}
            />
            <TextField
                label="Description"
                value={videoData.description}
                onChange={e => setVideoData({ ...videoData, description: e.target.value })}
            />
            {/* <TextField
                label="User ID"
                value={videoData.ownerId}
				placeholder={userId}
                onChange={e => setVideoData({ ...videoData, ownerId: userId })}
            />
            <TextField
                label="User Name"
                value={videoData.ownerName}
				placeholder={userName}
                onChange={e => setVideoData({ ...videoData, ownerName: userName })}
            /> */}
			{/* <Box>
				<FileDropzone
				accept="video/*"
				files={files}
				onDrop={handleDrop}
				onRemove={handleRemove}
				onRemoveAll={handleRemoveAll}
				onChange={e => setformatData(e.target.files[0])}
				/>
			</Box> */}
            <input type="file" accept="video/*" onChange={e => setformatData(e.target.files)} /> {/* Removed [0] from e.target.files[0] */}
			{/* {console.log('user', {userName, userId})} */}
            <IconButton onClick={uploadVideo}>
                <Publish />
            </IconButton>
        </Box>
    );
};

export default VideoAdd;
