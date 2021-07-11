/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { createForm } from '../../../graphql/mutations';
// import { v4 as uuid } from 'uuid';
import Amplify, { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import {
	// Card,
	// CardHeader,
	// CardContent,
	IconButton,
	TextField,
	Box
} from '@material-ui/core';
import { uniqueId } from 'lodash';
import { Publish } from '@material-ui/icons';
import { Formik } from 'formik';

const CreateFormDesign = ({ onUpload }) => {
	const [createFormData, setcreateFormData] = useState({});
    const [formatData, setformatData] = useState();

	const uploadVideo = async () => {
		//Get user attributes
		const { signInUserSession } = await Auth.currentAuthenticatedUser();
		const userName = signInUserSession.accessToken.payload.username;
		const userId = signInUserSession.accessToken.payload.sub

		console.log('user name', userName);
		console.log('user id', userId);

        //Upload the video
		const videoId = uniqueId("formID-");
		console.log('unique id', videoId)
        console.log('createFormData', createFormData);
        const { title, description, showcase, order, ownerName, ownerId } = createFormData;
        const { key } = await Storage.put(`${userId}/${title}_${videoId}.mp4`, formatData, { contentType: 'video/*' });

        const createFormInput = {
            id: videoId,
            owner: userId,
            company,
			title,
        };
        await API.graphql(graphqlOperation(createForm, { input: createFormInput }));
        onUpload();
    };

  return (
    <Box
		sx={{
			p: 10
		}}
    >
      {/* <Formik> */}
		<TextField
			sx={{
				m: 1
			}}
			label="Title"
			value={createFormData.title}
			onChange={e => setcreateFormData({ ...createFormData, title: e.target.value })}
		/>
		<TextField
			sx={{
				m: 1
			}}
			label="Company"
			value={createFormData.title}
			onChange={e => setcreateFormData({ ...createFormData, title: e.target.value })}
		/>
		{/* </Formik> */}
		<IconButton
			onClick={uploadVideo}
			sx={{
				m: 1
			}}
		>
			<Publish />
		</IconButton>
    </Box>
  );
}

// CreateFormDesign.propTypes = {

// }

export default CreateFormDesign;
