/* eslint-disable */
import React, { useState, useEffect } from 'react'
import {
	Box,
	IconButton,
	Paper,
	Typography,
	// Typography
} from '@material-ui/core'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import { listForms } from '../../graphql/queries'
import { Grid } from '@material-ui/core'

const TestList = () => {
	const [forms, setForms] = useState([]);

	useEffect(() => {
		fetchForms();
	}, [])

	const fetchForms = async () => {
		try {
			const formData = await API.graphql(graphqlOperation(listForms));
			const formList = formData.data.listForms.items;
			console.log('form list', formList);
			setForms(formList);
		} catch (error) {
			console.log('error on fetching forms', error);
		}
	}
	const idx = 0;

	return (
		<Box
			width="100%"
			alignItems="center"
			justify="center"
			margin="auto"
		>
			{forms.map((form, idx) => {
				return <Paper variant="outlined" sx={{py: 2, px: 5, m: 1}} key={`form_${idx}`}>
					<Grid
						container
						display="flex"
						className="formCard"
						direction="column"
						alignItems="left"
						justify="center"
					>
						<Grid item xs={12}>
							<Typography variant="h4" className="formTitle">{form.title}</Typography>
							<Typography variant="h5" className="formTitle">{form.id}</Typography>
							<Typography className="formTitle">{form.description}</Typography>
              <Typography className="formDescription">{form.validations}</Typography>
						</Grid>
					</Grid>
				</Paper>
			})}
		</Box>
	)
}

export default TestList;