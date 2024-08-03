import React, { useState } from "react";
import StepProgressBar from "react-step-progress";
import "react-step-progress/dist/index.css";
import "./ProgressB.css"
import { useDropzone } from 'react-dropzone';

export const ProgressB = () => {
  const [tagList, setTagList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
        setUploadedFiles(acceptedFiles);
        console.log(acceptedFiles);
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                const binaryStr = reader.result
                const blob = new Blob([binaryStr], { type: 'image/jpeg' }); // Adjust the MIME type as necessary
                // Create a URL for the Blob
                const url = URL.createObjectURL(blob);
                // Set the URL as the image source
                setImageUrl(url);
            }
            reader.readAsArrayBuffer(file)
        })
    },
});
  const step1Content = <div>
    <input {...getInputProps()} />
    <p>Drag and drop files here or click <span {...getRootProps()} className="highlight" >here</span> to browse.</p>
    {imageUrl && <img src={imageUrl} />}
  </div>;
  const step2Content = <h1>Step 2 Content</h1>;
  const step3Content = <h1>Step 3 Content</h1>;
  const step4Content = <h1>Step 4 Content</h1>;
  function step1Validator() {
    // return a boolean
    console.log(imageUrl);
    console.log(uploadedFiles);
    if (imageUrl.length !== 0) {
      return true;
    }
    return false;
  }
  function step2Validator() {
    // return a boolean
    if (imageUrl) {
      return true;
    }
    return false;
  }

  function step3Validator() {
    // return a boolean
    return true
  }

  function onFormSubmit() {
    // handle the submit logic here
    // This function will be executed at the last step
    // when the submit button (next button in the previous steps) is pressed
  }

  return (
    <div className="upload-form">
      <div>
        Image Upload
      </div>
      <div className="progress-wrapper">
        <StepProgressBar
          startingStep={0}
          onSubmit={onFormSubmit}
          primaryBtnClass="next-button"
          secondaryBtnClass="prev-button"
          steps={[
            {
              label: "Select Images",
              name: "Select Images",
              content: step1Content,
              validator: step1Validator
            },
            {
              label: "Add Tags",
              name: "Add Tags",
              content: step2Content,
              validator: step2Validator
            },
            {
              label: "Uploading",
              name: "Uploading",
              content: step3Content,
              validator: step3Validator
            },
            {
              label: "Summary",
              name: "Summary",
              content: step4Content,
              validator: step3Validator
            }
          ]}
        />
      </div>
    </div>

  );
};
