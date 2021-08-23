import React, { useState, useEffect } from 'react';

const storeImages = () => {

  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const types = ["image/png", "image/jpeg", "image/jpg"];

  const handleImgStateChange = (e) => {
    let selectedImgArray = Array.from(e.target.files).map(files);

    if (selectedImgArray) {
      if (types.includes(selectedImgArray.type)) {
        setError(null);
        setFile(...selectedImgArray, image.formId)
        console.log("storeImages.js", selectedImgArray)
      } else {
        setFile(null);
        setError("Please select an image file (png or jpg)");
      }
    }
  }
    //   return (
    //     <div className="App">
    //         <form>
    //             <label>
    //                 <input type="file" onChange={handleImgStateChange} />
    //                 <span>Upload Image</span>
    //             </label>
    //         </form>
    //     </div>
    // );
}

export default storeImages;