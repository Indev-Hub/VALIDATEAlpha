import {
    Button,
    Card,
    Grid,
    Input,
    TextField
} from '@material-ui/core';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { Plus } from 'src/icons';
import InputText from './InputText';
import { Box } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const FormCreate = () => {
    const [ownerState, setOwnerState] = useState({
        owner: '',
        description: '',
    });

    const handleOwnerChange = (e) => setOwnerState({
        ...ownerState,
        [e.target.name]: [e.target.value],
    });

    const blankInput = {name: '', age: '' };
    const [inputState, setInputState] = useState([
        { ...blankInput },
    ]);

    const addInput = () => {
        setInputState([...inputState, { ...blankInput }]);
    };

    const handleInputChange = (e) => {
        const updatedInputs = [...inputState];
        updatedInputs[e.target.dataset.idx][e.target.id] = e.target.value;
        setInputState(updatedInputs);
        // console.log('updated inputs:', updatedInputs)
    };

    console.log(inputState)

    return (
        <Formik>
            <form>
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
                {
                    inputState.map((val, idx) => {
                        const questionId = `question-${idx}`;
                        const typeId = `type-${idx}`;
                        const optionId = `option-${idx}`;
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
                                                value={inputState[idx].name}
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
                <input type="submit" value="Submit" />
            </form>
        </Formik>
    );
};

export default FormCreate;