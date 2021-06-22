/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { createCompany, createForm } from '../../../graphql/mutations';
// import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import Amplify, { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import {
	Button,
	Box,
	Card,
	CardHeader,
	CardContent,
	Grid,
	IconButton,
	MenuItem,
	TextField,
	Select
} from '@material-ui/core';
import { uniqueId } from 'lodash';
import { Publish } from '@material-ui/icons';
import { ErrorMessage, FieldArray, Formik } from 'formik';
import { Plus } from 'src/icons';
import FileDropzone from 'src/components/FileDropzone';

const VideoAdd = ({ onUpload }) => {
	// Form dependencies
	const [formData, setFormData] = useState({});
	const [formatData, setformatData] = useState();
	console.log('formData', formData)

	// FileDropzone dependencies
	const [files, setFiles] = useState([]);
  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) => prevFiles.filter((_file) => _file.path
      !== file.path));
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };
	
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


  const uploadForm = async () => {
		//Get user attributes
		const { signInUserSession } = await Auth.currentAuthenticatedUser();
		const userName = signInUserSession.accessToken.payload.username;
		const userId = signInUserSession.accessToken.payload.sub

		// Destructure formData properties
		const { name, elements, description, showcase, order, ownerName, ownerId } = formData;

		// console.log('user name', userName);
		// console.log('user id', userId);

		//Upload the form
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

		// const { key } = await Storage.put(`${userId}/${title}_${formId}.mp4`, formatData, { contentType: 'form/*' });

		// the input data to be sent in our createForm request 
		const createFormInput = {
			id: `form-${formID}`,
			companyID: 'company-2',
			name: name,
			validations: JSON.stringify(formArray)
		};

		await API.graphql(graphqlOperation(createForm, { input: createFormInput }));
		console.log('formData', formData);

		onUpload();
	};

	return (
		<Box>
			<TextField
				label="Form Name"
				value={formData.name}
				fullWidth
				onChange={e => setFormData({ ...formData, name: e.target.value })}
			/>
			<TextField
				label="Company"
				value={formData.company}
				fullWidth
				onChange={e => setFormData({ ...formData, company: e.target.value })}
				sx={{mt:2}}
			/>

			{/* <Box sx={{ mt: 3 }}>
				<Card>
					<CardHeader title="Upload Elements" />
					<CardContent>
					<FieldArray name="elements">
						{({ insert, remove, push }) => (
							<Box>
								{formData.elements.length > 0 &&
									{formData.map((element, index) => (
										<Grid key={index} display="flex">
											<Box width="100%">
												<Grid sx={{ m:1 }}>
												<TextField
													label="Question Type"
													name={`element.${index}.type`}
													value={`formData.element.${index}.type`}
													fullWidth
													onChange={e => setFormData({ ...formData.elements, name: e.target.value })}
												/>
												<TextField
													label="Company"
													value={formData.elements.company}
													fullWidth
													onChange={e => setFormData({ ...formData.elements, company: e.target.value })}
													sx={{mt:2}}
												/>
												</Grid>
												<Grid sx={{ m:1 }}>
													<FileDropzone
														accept="image/*"
														files={files}
														onDrop={handleDrop}
														onRemove={handleRemove}
														onRemoveAll={handleRemoveAll}
													/>
												</Grid>
											</Box>
											<Grid item xs={2}>
												<Button
													type="button"
													onClick={() => remove(index)}
												>
													X
												</Button>
											</Grid>
										</Grid>
									))}
								<Button
									onClick={() => push({ name: '', email: '' })}
									variant="contained"
									color="secondary"
									sx={{ m:1, pr:3 }}
									startIcon={<Plus />}
								>
									Add Logo
								</Button>
							</Box>
						)}
					</FieldArray>
					</CardContent>
				</Card>
			</Box> */}


			<Button
				sx={{ mt: 3, padding: 2 }}
				fullWidth
				color="primary"
				type="submit"
				variant="contained"
				onClick={uploadForm()}
			>
				CREATE FORM
			</Button>
			{/* <IconButton fullWidth onClick={uploadForm}>
				Create Form <Publish />
			</IconButton> */}
		</Box>
	);
};

export default VideoAdd;
