// import React, { useState } from "react";
// import { Button, Grid, IconButton, Typography } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import { Close } from "@material-ui/icons";
// import PropTypes from "prop-types";

// const useStyles = makeStyles(() => ({
//   closeButton: {
//     position: "absolute",
//     right: "20px",
//   },
// }));

// const UploadMultiplePreview = (props) => {
//   const classes = useStyles();

//   // Deconstruct props from FormQuestions
//   const {
//     formId,
//     questionIdx,
//     updateRadioImagesOptions,
//     toggleDialog,
//     formImages,
//     setFormImages,
//     handleImageChange,
//     setSelectedFiles,
//     selectedFiles,
//     renderPhotos
//   } = props;

//   // Declare file input reference
//   const fileInput = React.useRef();

  // Create image array, generate path, call upload function
  // when form is submitted, and toggle off dialog
  // const onClick = () => {
  //   let images = fileInput.current.files;
  //   let imageUrls = [];
  //   let formCollection = [];
  //   Object.values(images).forEach((image, idx) => {
  //     const path = `${formId}/q${questionIdx + 1}_a${idx + 1}_${image.name}`;
  //     imageUrls.push(path);
  //     formCollection.push([path, image]);
  //   });
  //   setFormImages([...formImages, ...formCollection]);
  //   console.log("formImages#", formImages)
  //   updateRadioImagesOptions(questionIdx, imageUrls);
  //   toggleDialog(questionIdx);
  // };

//   return (
//     <Grid container justifyContent="center">
//       <Grid item style={{ marginTop: "10px", padding: 20 }}>
//         <IconButton
//           className={classes.closeButton}
//           type="button"
//           onClick={() => toggleDialog(questionIdx)}
//           id={`${questionIdx}`}
//         >
//           <Close />
//         </IconButton>

//         <Typography variant="h5" p={3}>
//           Upload Image Options
//         </Typography>

//         <Button variant="contained" component="label">
//           Upload Images
//           {/* Standard input wrapped in MUI Button for improved styling. */}
//           <input
//             type="file"
//             accept="image/png, image/gif, image/jpeg"
//             id="file"
//             ref={fileInput}
//             multiple
//             onChange={(e) => handleImageChange(e)}
//             hidden
//           />
//         </Button>

//         <Grid container className="result">
//           {renderPhotos(selectedFiles)}
//         </Grid>

//         {/* Display "Add Images" only if images have been selected. */}
//         {selectedFiles.length > 0 ? (
//           <Button
//             type="button"
//             variant="contained"
//             color="secondary"
//             style={{ marginTop: "10px" }}
//           // // onClick={() => onClick()}
//           >
//             Add Images
//           </Button>
//         ) : null}
//       </Grid>
//     </Grid>
//   );
// };

// UploadMultiplePreview.propTypes = {
//   formId: PropTypes.string,
//   questionIdx: PropTypes.number,
//   updateRadioImagesOptions: PropTypes.func,
//   toggleDialog: PropTypes.func,
//   formImages: PropTypes.array,
//   setFormImages: PropTypes.func,
//   selectedFiles: PropTypes.array,
//   setSelectedFiles: PropTypes.func,
//   handleImageChange: PropTypes.func,
// };

// export default UploadMultiplePreview;
