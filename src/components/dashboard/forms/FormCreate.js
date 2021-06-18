import {
    Button,
    Card,
    Grid,
    TextField
} from '@material-ui/core';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { Plus } from 'src/icons';
import { Box } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { uniqueId } from 'lodash';
import { createForm } from 'src/graphql/mutations';

const FormCreate = () => {
    // Company part of form
    const [ownerState, setOwnerState] = useState({
        owner: '',
        description: '',
    });

    // Update to company part of form
    const handleOwnerChange = (e) => setOwnerState({
        ...ownerState,
        [e.target.name]: [e.target.value],
    });

    // Validation questions part of form
    const blankInput = {};
    const [inputState, setInputState] = useState([
        { ...blankInput },
    ]);

    // Add question to form and add the new question to our inputState array
    const addInput = () => {
        setInputState([...inputState, { ...blankInput }]);
    };

    // Removes question from mapped array. Currently does not update values but needs to.
    // SOMETHING BROKE IN THIS FUNCTION AND IT HASN"T BEEN FIXED YET!
    const removeInput = (index) => {
        const array = [...inputState]; //make copy
        array.splice(index, 1);
        setInputState([...array]);
      };
      

    // Update question portion of form every time a field is modified
    const handleInputChange = (e) => {
        const updatedInputs = [...inputState];
        updatedInputs[e.target.dataset.idx][e.target.id] = e.target.value;
        setInputState(updatedInputs);
        // console.log('updated inputs:', updatedInputs)
    };

    const uploadForm = async () => {
		//Get user attributes
		const { signInUserSession } = await Auth.currentAuthenticatedUser();
		const userName = signInUserSession.accessToken.payload.username;
		const userId = signInUserSession.accessToken.payload.sub

		// Destructure form properties
        const { name, description } = ownerState; 
		const { type, question, option  } = inputState;
        const formID = uniqueId();
        const formArray = [
            {
                "question": question,
                "type": type,
                "options": option
            }
        ];

		// the input data to be sent in our createForm request 
		const createFormInput = {
			id: `form-${formID}`,
			companyID: 'company-2',
			name: name,
            description: description,
			validations: JSON.stringify(formArray)
		};

		await API.graphql(graphqlOperation(createForm, { input: createFormInput }));
		console.log('formData', createFormInput);
	};

    console.log(inputState)

    return (
        <Formik>
            <form>

                {/* Business info part of the form */}
                <TextField
                    label="Form Name"
                    type="text"
                    name="name"
                    id="name"
                    value={ownerState.name}
                    onChange={handleOwnerChange}
                    fullWidth
                />
                <TextField
                    label="Form Description"
                    type="text"
                    name="description"
                    id="description"
                    value={ownerState.description}
                    onChange={handleOwnerChange}
                    fullWidth
                    sx={{
                        mt:2
                    }}
                />

                {/* Start mapping the validation questions */}
                {
                    inputState.map((val, idx) => {
                        const questionId = `question-${idx}`;
                        const typeId = `type-${idx}`;
                        const optionId = `option-${idx}`;
                        const deleteId = `delete-${idx}`;
                        return (
                            <Card key={`input-${idx}`} sx={{my:1}}>
                                <Box sx={{backgroundColor:'black', p:1, color:'white'}}>
                                    <Typography variant="h6" fullWidth align='center'>{`Question ${idx + 1}`}</Typography>
                                </Box>
                                <Grid container display="flex" sx={{p:2}}>
                                    <Grid item xs>
                                        <Box>
                                            <Typography>Question</Typography>
                                        </Box>
                                        <Box>
                                            <input
                                                type="text"
                                                name={questionId}
                                                placeholder={`Question #${idx + 1}`}
                                                data-idx={idx}
                                                id="question"
                                                className="question"
                                                value={inputState[idx].question}
                                                onChange={handleInputChange}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs>
                                        <Box>
                                            <Typography>Answer Type</Typography>
                                        </Box>
                                        <Box>
                                            <input
                                                type="text"
                                                name={typeId}
                                                placeholder={`Question #${idx + 1} Answer Type`}
                                                data-idx={idx}
                                                id="type"
                                                className="type"
                                                value={inputState[idx].type}
                                                onChange={handleInputChange}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs>
                                        <Box>
                                            <Typography>Options</Typography>
                                        </Box>                                        
                                        <input
                                            type="text"
                                            name={optionId}
                                            placeholder={`Answers for Question #${idx + 1}`}
                                            data-idx={idx}
                                            id="option"
                                            className="option"
                                            value={inputState[idx].option}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button
                                            type="button"
                                            onClick={() => removeInput(idx)}
                                            id={idx}
                                        >
                                            X
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        );
                    })
                }
                <Button
                    type="button"
                    onClick={addInput}
                    variant="contained"
                    color="secondary"
                    sx={{ m:1, pr:3 }}
                    startIcon={<Plus />}
                    >
                    Add Validation
                </Button>
                <Button
                    sx={{ mt: 3, padding: 2 }}
                    fullWidth
                    color="primary"
                    type="submit"
                    variant="contained"
                    onClick={uploadForm}
                >
                    CREATE FORM
                </Button>
                <input type="submit" value="Submit" />
            </form>
        </Formik>
    );
};

export default FormCreate;