import React from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Chip,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Plus } from "../../../icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import Controls from "../../form/controls/_controls";

// FORM DETAILS SECTION OF FormCreate.js

const FormDetails = (props) => {
  // Deconstruct state props from FormCreate.js
  const { userData, detailsState, setDetailsState } = props;

  // Update details portion of form every time a field is modified
  const handleDetailsInput = (e) =>
    setDetailsState({
      ...detailsState, // make copy
      [e.target.name]: e.target.value,
    });

  // Update public/private state when toggled
  const handlePublicPrivateChange = (e) =>
    setDetailsState({
      ...detailsState, // make copy
      [e.target.name]: e.target.checked,
    });

  // Add tag to form and add the new tag to detailsState array
  const addTag = (tagidx, e) => {
    setDetailsState({
      ...detailsState, // make copy
      tags: [...detailsState.tags, e.target.value],
    });
  };
  // Remove tag from mapped array
  const removeTag = (tagidx) => {
    const updatedState = { ...detailsState }; // make copy
    updatedState.tags.splice(tagidx, 1);
    setDetailsState(updatedState);
  };

  // Update tag input every time a field is modified
  const handleTagInput = (tagidx, e) => {
    const updatedState = { ...detailsState }; // make copy
    updatedState.tags[tagidx] = e.target.value;
    setDetailsState(updatedState);
  };

//   onDragEnd = result => {
// // will synchronously update state to reflect drag and drop result. Might not go here...
//   }  

  // Render form details section of FormCreate.js
  return (
    <React.Fragment>
      <Grid container alignItems="flex-start" justifyContent="space-between">
        <Grid item xs={9}>
          <Grid container>
            <Grid item xs={12}>
              <Controls.TextField
                label="Form Name"
                type="text"
                name="title"
                id="title"
                value={detailsState.title}
                onChange={handleDetailsInput}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Controls.TextField
                label="Form Description"
                type="text"
                name="description"
                id="description"
                value={detailsState.description}
                onChange={handleDetailsInput}
                fullWidth
              />
            </Grid>
            <DragDropContext>
              <Grid item xs={12} mt={2}>
                <Grid container alignItems="center">
                  {/* Start mapping tags */}
                  {detailsState.tags.map((_tag, tagidx) => {
                    return (
                      <Box key={`tag-${tagidx}`} sx={{ my: 0 }}>
                        <Grid container display="flex" sx={{ pb: 1 }}>
                          <Grid item xs={8}>
                            <Chip
                              label={detailsState.tags[tagidx]}
                              type="text"
                              name={`tag-${tagidx + 1}`}
                              data-idx={tagidx}
                              id={`${tagidx}`}
                              className="tag"
                              value={detailsState.tags[tagidx]}
                              onChange={(e) => handleTagInput(tagidx, e)}
                              onDelete={()=>removeTag(tagidx)}
                              sx={{ m: 1}}
                            />
                          </Grid>
                          {/* <Grid item>
                            <IconButton
                              type="button"
                              id={`${tagidx}`}
                              onClick={() => removeTag(tagidx)}
                            >
                              <Close />
                            </IconButton>
                          </Grid> */}
                        </Grid>
                      </Box>
                    );
                  })}
                </Grid>
                {detailsState.availableTags.map((_tag, tagidx) => {
                  return (
                  <Chip
                  key={tagidx}
                  label={detailsState.availableTags[tagidx]}
                  type="text"
                  name={`tag-${tagidx + 1}`}
                  data-idx={tagidx}
                  id={`${tagidx}`}
                  className="tag"
                  value={detailsState.availableTags[tagidx]}
                  onClick={(e) => addTag(tagidx, e)}
                  sx={{ m: 1}}
                  color="secondary"
                  />
                  )
                })}
                {/* <Draggable> */}
                  {/* <Chip onClick={addTag} label="Logo" color="secondary" value="LOGO" id="logo-chip" sx={{ m: 1 }}/>
                  <Chip onClick={addTag} label="Images" color="secondary" value="IMAGES" id="images-chip" sx={{ m: 1}}/>
                  <Chip onClick={addTag} label="Swag" color="secondary" value="SWAG" id="swag-chip" sx={{ m: 1}}/> */}
                {/* </Draggable> */}
                {/* <Droppable droppableId={this.props.column.id}></Droppable> */}
                {/* <Button
                  type="button"
                  onClick={addTag}
                  variant="contained"
                  color="inherit"
                  sx={{ m: 1, pr: 3 }}
                  startIcon={<Plus />}
                >
                  Add Tag
                </Button> */}
              </Grid>
            </DragDropContext>
          </Grid>
        </Grid>
        <Grid item px={2} xs={3}>
          <Card
            sx={{
              // backgroundColor: 'blue',
              p: 3,
            }}
          >
            <Controls.Switch
              altlabel="Public or Private?"
              label={detailsState.isPrivate ? "Private" : "Public"}
              name="isPrivate"
              id="isPrivate"
              checked={detailsState.isPrivate}
              value={detailsState.isPrivate ? "Private" : "Public"}
              onChange={handlePublicPrivateChange}
            />
            <TextField
              select
              fullWidth
              label="Company"
              name="companyID"
              value={detailsState.companyID}
              onChange={handleDetailsInput}
              required
            >
              {userData ? (
                userData.companies.items.map((company) => (
                  <MenuItem value={company.id}>{company.name}</MenuItem>
                ))
              ) : (
                <Typography>Loading Companies</Typography>
              )}
            </TextField>
            {console.log("userData", userData)}
            {console.log("detailsState", detailsState)}
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

FormDetails.propTypes = {
  detailsState: PropTypes.object,
  setDetailsState: PropTypes.func,
};

export default FormDetails;
