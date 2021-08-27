import React, { useState, useEffect } from "react";
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
import { TAGS } from "./FormConstants.js";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

// FORM DETAILS SECTION OF FormCreate.js
const FormDetails = (props) => {
  // Deconstruct state props from FormCreate.js
  const { userData, detailsState, setDetailsState } = props;

  //updates the list of available tags once the state of tags is changed
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const filteredTags = TAGS.filter(tag => !detailsState.tags.includes(tag));
    setAvailableTags(filteredTags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailsState.tags])

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
    const tagToAdd = availableTags[tagidx];
    setDetailsState({
      ...detailsState, // make copy
      tags: [...detailsState.tags, tagToAdd],
    });
  };

  // Remove tag from mapped array
  const removeTag = (tagidx) => {
    const tagToRemove = detailsState.tags[tagidx];
    const newTags = detailsState.tags.filter(e => e !== tagToRemove)
    setDetailsState({
      ...detailsState,
      tags: newTags,
    });
  };

  const validate = () => {
    let temp = {};
    temp.title = detailsState.title ? "" : "This field is required"
  }

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
              <Grid alignItems="center">
                <Card
                  sx={{
                    p: 3,
                  }}
                >
                  <Typography>
                    Available tags for form validation:
                  </Typography>
                  {/* Start mapping though the available tags */}
                  {availableTags.map((_tag, tagidx) => {
                    return (
                      <Chip
                        key={tagidx}
                        label={availableTags[tagidx]}
                        type="text"
                        name={`tag-${tagidx + 1}`}
                        data-idx={tagidx}
                        id={`${tagidx}`}
                        className="tag"
                        value={availableTags[tagidx]}
                        onClick={() => addTag(tagidx)}
                        sx={{ m: 1 }}
                        color="secondary"
                      />
                    )
                  })}
                </Card>
              </Grid>
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
                  onDelete={() => removeTag(tagidx)}
                  sx={{ m: 1 }}
                  color="primary"
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
