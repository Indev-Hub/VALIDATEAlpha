import React, { useState } from "react";
import {
  Card,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Chip,
} from "@material-ui/core";
import { Close, EventAvailableOutlined } from "@material-ui/icons";
import { Plus } from "../../../icons";
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
  const addTag = (tagidx) => {
    const tagToAdd = detailsState.availableTags[tagidx];
    const newAvailableTags = detailsState.availableTags.filter(e => e !== tagToAdd);
    setDetailsState({
      ...detailsState, // make copy
      tags: [...detailsState.tags, tagToAdd],
      availableTags: newAvailableTags,
    });
  };
  
  // Remove tag from mapped array
  const removeTag = (tagidx) => {
    const tagToRemove = detailsState.tags[tagidx];
    const newTags = detailsState.tags.filter(e => e !== tagToRemove)
    setDetailsState({
      ...detailsState,
      tags: newTags,
      availableTags: [...detailsState.availableTags, tagToRemove]
    });
  };

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
              <Grid item xs={12} mt={2}>
                <Grid container alignItems="center">
                </Grid>
                {/* Start mapping though the available tags */}
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
                          onClick={() => addTag(tagidx)}
                          sx={{ m: 1}}
                          color="secondary"
                          />
                      )
                    })}
              </Grid>
          </Grid>
        </Grid>
        <Grid item px={2} xs={3}>
          <Card
            sx={{
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
            >
              {userData ? (
                userData.companies.items.map((company) => (
                  <MenuItem value={company.id}>{company.name}</MenuItem>
                  ))
                  ) : (
                    <Typography>Loading Companies</Typography>
                    )}
            </TextField>
                    {detailsState.tags.map((_tag, tagidx) => {
                      return (
                        <Chip
                          key={tagidx}
                          label={detailsState.tags[tagidx]}
                          type="text"
                          name={`tag-${tagidx + 1}`}
                          data-idx={tagidx}
                          id={`${tagidx}`}
                          className="tag"
                          value={detailsState.tags[tagidx]}
                          onDelete={()=>removeTag(tagidx)}
                          sx={{ m: 1}}
                        />
                        );
                  })}
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
