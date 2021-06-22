import { Typography } from '@material-ui/core';
import {
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Plus } from 'src/icons';

const FormCreate = () => {
    const [ownerState, setOwnerState] = useState({});

    const handleOwnerChange = (e) => setOwnerState({
        ...ownerState,
        [e.target.name]: [e.target.value],
    });

    const blankInput = {};
    const [inputState, setInputState] = useState([
        { ...blankInput },
    ]);

    const addInput = () => {
        setInputState([...inputState, { ...blankInput }]);
    };

    const handleInputChange = (e) => {
      const updatedInputs = [...inputState];
      updatedInputs[e.target.dataset.idx][e.target.className] = e.target.value;
      setInputState([...updatedInputs]);
    };

    console.log(ownerState, inputState)

    return (
      <Formik>
        <form>
          <Box>
            {/* <label htmlFor="owner">Owner</label>
            <input
                type="text"
                name="owner"
                id="owner"
                value={ownerState.owner}
                onChange={handleOwnerChange}
            /> */}
            <TextField
              label="Form Name"
              name="name"
              value={ownerState.name}
              onChange={handleOwnerChange}
              fullWidth
            />
            {/* <label htmlFor="description">Description</label>
            <input
                type="text"
                name="description"
                id="description"
                value={ownerState.description}
                onChange={handleOwnerChange}
            /> */}
            <TextField
              label="Description"
              name="description"
              value={ownerState.description}
              onChange={handleOwnerChange}
              fullWidth
              sx={{
                mt:1
              }}
            />
            {
                inputState.map((val, idx) => {
                    const typeId = `type-${idx}`;
                    const questionId = `question-${idx}`;
                    const optionId = `option-${idx}`;
                    return (
                      <Card key={`input-${idx}`} sx={{p:2, my:1}}>
                        <Typography variant="h5" pb={1}>{`Validation Item ${idx + 1}`}</Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            {/* <label htmlFor={typeId}>{`Input #${idx + 1}`}</label>
                            <input
                                type="text"
                                name={typeId}
                                data-idx={idx}
                                id={typeId}
                                className="name"
                                value={inputState[idx].name}
                                onChange={handleInputChange}
                            /> */}
                            <input
                                label={`Question ${idx + 1}`}
                                type="text"
                                name={questionId}
                                data-idx={idx}
                                id={questionId}
                                className="question"
                                value={inputState[idx].question}
                                onChange={handleInputChange}
                            />
                          </Grid>
                          {/* <Grid item xs={6}>
                            <FormControl
                              variant="outlined"
                              fullWidth
                            >
                              <InputLabel>Question Type</InputLabel>
                              <Select
                                name={typeId}
                                data-idx={idx}
                                id={typeId}
                                className="type"
                                value={inputState[idx].type}
                                onChange={handleInputChange}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value="Text">Text Input</MenuItem>
                                <MenuItem value="Select">Dropdown Menu</MenuItem>
                                <MenuItem value="Checkbox">Checkbox</MenuItem>
                                <MenuItem value="ImageArray">Images</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              type="text"
                              label={`Options`}
                              name={optionId}
                              data-idx={idx}
                              id={optionId}
                              className="name"
                              value={inputState[idx].optionId}
                              onChange={handleInputChange}
                              fullWidth
                            />
                          </Grid> */}
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
          </Box>
        </form>
      </Formik>
    );
};

export default FormCreate;